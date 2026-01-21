import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

interface UseRazorpayProps {
  onSuccess: (paymentId: string, registrationId: string) => void;
  onFailure: (error: string) => void;
}

export const useRazorpay = ({ onSuccess, onFailure }: UseRazorpayProps) => {
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

  const createOrder = useCallback(
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
        const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
          body: params,
        });

        if (error || !data?.success) {
          throw new Error(data?.error || error?.message || "Failed to create order");
        }

        return data;
      } catch (err: any) {
        console.error("Order creation error:", err);
        onFailure(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [onFailure]
  );

  const verifyPayment = useCallback(
    async (response: RazorpayResponse, registrationId: string) => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-razorpay-payment", {
          body: {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            registrationId,
          },
        });

        if (error || !data?.success) {
          throw new Error(data?.error || "Payment verification failed");
        }

        return true;
      } catch (err: any) {
        console.error("Verification error:", err);
        onFailure(err.message);
        return false;
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

      const orderData = await createOrder(params);
      if (!orderData) return;

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VIBRANCE 2026",
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
          const verified = await verifyPayment(response, orderData.registrationId);
          setIsLoading(false);
          if (verified) {
            onSuccess(response.razorpay_payment_id, orderData.registrationId);
          }
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
    [isScriptLoaded, createOrder, verifyPayment, onSuccess]
  );

  return { initiatePayment, isLoading };
};
