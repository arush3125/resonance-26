// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔍 Debug: Function started");
    
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    console.log("🔍 Debug: Environment variables:");
    console.log("RAZORPAY_KEY_ID exists:", !!RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET exists:", !!RAZORPAY_KEY_SECRET);
    
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.log("❌ Debug: Missing Razorpay credentials");
      throw new Error("Razorpay credentials not configured");
    }

    console.log("✅ Debug: Credentials found, proceeding with order creation");
    
    const data = await req.json();
    console.log("🔍 Debug: Request data:", data);
    
    const { entryFee } = data;
    
    // Create Razorpay order
    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    console.log("🔍 Debug: Auth token created");
    
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: entryFee * 100,
        currency: "INR",
        receipt: `vibrance_${Date.now()}`,
      }),
    });

    console.log("🔍 Debug: Razorpay API response status:", orderResponse.status);
    
    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("❌ Debug: Razorpay order creation failed:", errorText);
      throw new Error(`Razorpay API error: ${orderResponse.status} - ${errorText}`);
    }

    const order = await orderResponse.json();
    console.log("✅ Debug: Order created successfully:", order);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        registrationId: "test-reg-id",
        keyId: RAZORPAY_KEY_ID,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create Razorpay order";
    console.error("❌ Debug: Error creating order:", error);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
