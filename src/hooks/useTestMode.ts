import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseTestModeProps {
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

export const useTestMode = ({ onSuccess, onFailure }: UseTestModeProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const simulatePayment = useCallback(
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
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate a fake payment ID
        const testPaymentId = `test_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('🧪 Test Mode: Simulated payment successful');
        console.log('🧪 Test Payment ID:', testPaymentId);
        console.log('🧪 Test Data:', params);

        // Show success message
        toast.success(`🧪 Test Mode: Registration successful for ${params.name}!`);
        
        // Call success callback with test payment ID
        onSuccess(testPaymentId);
        
      } catch (error) {
        const message = error instanceof Error ? error.message : "Test payment failed";
        console.error('🧪 Test Mode Error:', error);
        onFailure(message);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onFailure]
  );

  return { 
    initiatePayment: simulatePayment, 
    isLoading,
    isTestMode: true
  };
};
