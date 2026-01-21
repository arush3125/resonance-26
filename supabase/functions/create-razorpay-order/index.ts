import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  name: string;
  email: string;
  phone: string;
  college: string;
  eventId: string;
  eventName: string;
  entryFee: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const data: OrderRequest = await req.json();
    const { name, email, phone, college, eventId, eventName, entryFee } = data;

    // Create Razorpay order
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: entryFee * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `vibrance_${Date.now()}`,
        notes: {
          event_id: eventId,
          event_name: eventName,
          participant_name: name,
          participant_email: email,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("Razorpay order creation failed:", errorText);
      throw new Error("Failed to create Razorpay order");
    }

    const order = await orderResponse.json();

    // Create registration record in database
    const { data: registration, error: dbError } = await supabase
      .from("registrations")
      .insert({
        name,
        email,
        phone,
        college,
        event_id: eventId,
        event_name: eventName,
        entry_fee: entryFee,
        razorpay_order_id: order.id,
        payment_status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to create registration");
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        registrationId: registration.id,
        keyId: RAZORPAY_KEY_ID,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
