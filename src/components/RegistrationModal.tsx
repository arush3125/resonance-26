import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/data/festivalData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal = ({ event, isOpen, onClose }: RegistrationModalProps) => {
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.college) {
      toast.error("Please fill all fields");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setStep("payment");
      setIsLoading(false);
    }, 1000);
  };

  const sendConfirmationEmail = async (generatedPaymentId: string) => {
    if (!event) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("send-confirmation-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          eventName: event.name,
          eventDate: event.date,
          eventTime: event.time,
          eventVenue: event.venue,
          entryFee: event.entryFee,
          paymentId: generatedPaymentId,
        },
      });

      if (error) {
        console.error("Email error:", error);
        toast.error("Registration successful but email failed to send");
      } else {
        toast.success("Confirmation email sent!");
      }
    } catch (err) {
      console.error("Email send error:", err);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    // Simulated payment - replace with Razorpay integration
    const generatedPaymentId = `PAY_${Date.now()}`;
    setPaymentId(generatedPaymentId);
    
    toast.info("Razorpay integration ready - configure API keys to enable payments");
    
    // Send confirmation email
    await sendConfirmationEmail(generatedPaymentId);
    
    setStep("success");
    setIsLoading(false);
  };

  const handleClose = () => {
    setStep("form");
    setFormData({ name: "", email: "", phone: "", college: "" });
    setPaymentId("");
    onClose();
  };

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-lg p-6 md:p-8 relative overflow-hidden"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>

            {step === "form" && (
              <div>
                <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Register for {event.name}</h3>
                <p className="text-muted-foreground mb-6">Entry Fee: ₹{event.entryFee}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="mt-1" /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="mt-1" /></div>
                  <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className="mt-1" /></div>
                  <div><Label htmlFor="college">College Name</Label><Input id="college" name="college" value={formData.college} onChange={handleInputChange} placeholder="Your College" className="mt-1" /></div>
                  <Button type="submit" variant="festival" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : "Proceed to Payment"}
                  </Button>
                </form>
              </div>
            )}

            {step === "payment" && (
              <div className="text-center">
                <CreditCard className="w-16 h-16 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-orbitron font-bold mb-2">Complete Payment</h3>
                <p className="text-muted-foreground mb-6">Amount: ₹{event.entryFee}</p>
                <div className="glass-card p-4 mb-6 text-left text-sm">
                  <p><strong>Event:</strong> {event.name}</p>
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                </div>
                <Button variant="festival" size="lg" className="w-full" onClick={handlePayment} disabled={isLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing Payment...</> : `Pay ₹${event.entryFee} with Razorpay`}
                </Button>
              </div>
            )}

            {step === "success" && (
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Registration Successful!</h3>
                <p className="text-muted-foreground mb-6">Confirmation email sent to {formData.email}</p>
                <div className="glass-card p-4 mb-6 text-left text-sm">
                  <p><strong>Event:</strong> {event.name}</p>
                  <p><strong>Payment ID:</strong> {paymentId}</p>
                  <p><strong>Amount:</strong> ₹{event.entryFee}</p>
                </div>
                <Button variant="festivalOutline" size="lg" onClick={handleClose}>Back to Events</Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
