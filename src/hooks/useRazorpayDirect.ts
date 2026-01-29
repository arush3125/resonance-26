import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}

interface UseRazorpayDirectProps {
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

export const useRazorpayDirect = ({ onSuccess, onFailure }: UseRazorpayDirectProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    if (document.getElementById("razorpay-script")) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      toast.error("Failed to load payment gateway");
      setIsScriptLoaded(false);
    };
    document.body.appendChild(script);
  }, []);

  const createOrderDirect = useCallback(
    async (params: {
      name: string;
      email: string;
      phone: string;
      college: string;
      eventId: string;
      eventName: string;
      entryFee: number;
    }) => {
      setIsLoading(true);

      try {
        // Create order directly using Razorpay API (bypassing Supabase for now)
        const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
        const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
          throw new Error("Razorpay credentials not configured");
        }

        const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
        
        const response = await fetch("/api/razorpay/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: params.entryFee * 100, // Convert to paise
            currency: "INR",
            receipt: `vibrance_${Date.now()}`,
            notes: {
              event_id: params.eventId,
              event_name: params.eventName,
              participant_name: params.name,
              participant_email: params.email,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Razorpay order creation failed:", errorText);
          throw new Error(`Failed to create order: ${response.status}`);
        }

        const order = await response.json();
        
        return {
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          registrationId: `reg_${Date.now()}`, // Temporary ID
          keyId: RAZORPAY_KEY_ID,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to create order";
        console.error("Order creation error:", err);
        onFailure(message);
        setIsLoading(false);
        return null;
      }
    },
    [onFailure]
  );

  const initiatePayment = useCallback(
    async (params: {
      name: string;
      email: string;
      phone: string;
      college: string;
      eventId: string;
      eventName: string;
      entryFee: number;
    }) => {
      if (!isScriptLoaded) {
        toast.error("Payment gateway not loaded. Please refresh and try again.");
        return;
      }

      const orderData = await createOrderDirect(params);
      if (!orderData) return;

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RESONANCE 26",
        description: `Registration for ${params.eventName}`,
        order_id: orderData.orderId,
        prefill: {
          name: params.name,
          email: params.email,
          contact: params.phone,
        },
        theme: {
          color: "#FF2FB3",
        },
        handler: async (response) => {
          setIsLoading(false);
          // For now, just call onSuccess without verification
          // In production, you should verify the signature
          onSuccess(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    },
    [isScriptLoaded, createOrderDirect, onSuccess]
  );

  return { initiatePayment, isLoading };
};
