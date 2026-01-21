import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { encode as hexEncode } from "https://deno.land/std@0.190.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const msgData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  const hexBytes = hexEncode(new Uint8Array(signature));
  return new TextDecoder().decode(hexBytes);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret not configured");
    }

    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.text();

    // Verify webhook signature
    if (signature) {
      const expectedSignature = await hmacSha256(RAZORPAY_KEY_SECRET, body);

      if (expectedSignature !== signature) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    const event = JSON.parse(body);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Webhook event received:", event.event);

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        const { error } = await supabase
          .from("registrations")
          .update({
            razorpay_payment_id: payment.id,
            payment_status: "paid",
          })
          .eq("razorpay_order_id", orderId);

        if (error) {
          console.error("Failed to update registration:", error);
        } else {
          console.log("Payment captured for order:", orderId);
        }
        break;
      }

      case "payment.failed": {
        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        const { error } = await supabase
          .from("registrations")
          .update({ payment_status: "failed" })
          .eq("razorpay_order_id", orderId);

        if (error) {
          console.error("Failed to update registration:", error);
        } else {
          console.log("Payment failed for order:", orderId);
        }
        break;
      }

      case "order.paid": {
        const order = event.payload.order.entity;
        console.log("Order paid:", order.id);
        break;
      }

      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
