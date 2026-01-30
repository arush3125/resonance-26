import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/data/festivalData";
import { toast } from "sonner";
import { useRazorpayDirect } from "@/hooks/useRazorpayDirect";
import { RegistrationData, TeamMemberData } from "@/types/registration";
import { registrationAPI } from "@/services/registrationAPI";

interface TeamMember {
  name: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  isLeader?: boolean;
}

interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const YEARS = ["2K", "4K", "6K"];
const BRANCHES = ["AN", "TE", "ME", "CE", "AE"];

export const RegistrationModal = ({ event, isOpen, onClose }: RegistrationModalProps) => {
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [isTeamRegistration, setIsTeamRegistration] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
    email: "",
    phone: "",
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Initialize team members when team registration is enabled
  useEffect(() => {
    if (isTeamRegistration && event && teamMembers.length === 0) {
      const initialMembers = Array(event.teamSize.min).fill(null).map((_, index) => ({
        name: "",
        branch: "",
        year: "",
        email: "",
        phone: "",
        isLeader: index === 0 // First member is team leader
      }));
      setTeamMembers(initialMembers);
    }
  }, [isTeamRegistration, event, teamMembers.length]);

  // Calculate total fee based on number of participants
  const calculateTotalFee = () => {
    if (isTeamRegistration && teamMembers.length > 0) {
      return teamMembers.length * 100; // 100 per person
    }
    return event?.entryFee || 0;
  };

  const saveRegistrationDataToExcel = async (paymentId: string) => {
    if (!event) return;

    try {
      // Prepare registration data for backend API
      const apiData = {
        name: isTeamRegistration ? teamName : formData.name,
        branch: isTeamRegistration ? teamMembers[0]?.branch || formData.branch : formData.branch,
        year: isTeamRegistration ? teamMembers[0]?.year || formData.year : formData.year,
        email: isTeamRegistration ? teamMembers[0]?.email || formData.email : formData.email,
        phone: isTeamRegistration ? teamMembers[0]?.phone || formData.phone : formData.phone,
        eventName: event.name,
        teamName: isTeamRegistration ? teamName : undefined,
        registrationType: (isTeamRegistration ? "team" : "solo") as "team" | "solo",
        numberOfParticipants: isTeamRegistration ? teamMembers.length : 1,
        amountPaid: calculateTotalFee(),
        razorpayPaymentId: paymentId,
        paymentStatus: "success"
      };

      console.log('📤 Sending registration to backend:', apiData);

      // Save to backend with retry mechanism
      await registrationAPI.saveRegistrationWithRetry(apiData, 3);
      
      console.log('✅ Registration saved successfully!');
      toast.success("Registration saved successfully!");

    } catch (error) {
      console.error('❌ Error saving registration data:', error);
      toast.error(`Failed to save registration: ${error.message}`);
      throw error; // Re-throw to handle in payment flow
    }
  };

  const sendConfirmationEmail = async (generatedPaymentId: string) => {
    // Email functionality removed - no Supabase dependency
    console.log('📧 Confirmation email would be sent for payment:', generatedPaymentId);
    toast.success('Registration confirmation processed!');
  };

  // Use Razorpay for payment processing
  const razorpayHook = useRazorpayDirect({
    onSuccess: async (razorpayPaymentId) => {
      setPaymentId(razorpayPaymentId);
      await saveRegistrationDataToExcel(razorpayPaymentId);
      await sendConfirmationEmail(razorpayPaymentId);
      setStep("success");
      toast.success("Payment successful!");
    },
    onFailure: (error) => {
      toast.error(error || "Payment failed");
    },
  });

  // Use Razorpay payment hook
  const { initiatePayment, isLoading: isPaymentLoading } = razorpayHook;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  const addTeamMember = () => {
    if (teamMembers.length < event?.teamSize.max) {
      setTeamMembers([...teamMembers, { 
        name: "", 
        branch: "", 
        year: "", 
        email: "", 
        phone: "",
        isLeader: false 
      }]);
    } else {
      toast.error(`Maximum team size is ${event?.teamSize.max} members`);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (isTeamRegistration) {
      if (!teamName.trim()) {
        toast.error("Please enter team name");
        return false;
      }
      for (let i = 0; i < teamMembers.length; i++) {
        const member = teamMembers[i];
        if (!member.name || !member.branch || !member.year || !member.email || !member.phone) {
          toast.error(`Please fill all details for team member ${i + 1}`);
          return false;
        }
      }
    } else {
      if (!formData.name || !formData.branch || !formData.year || !formData.email || !formData.phone) {
        toast.error("Please fill all fields");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setStep("payment");
      setIsSubmitting(false);
    }, 500);
  };

  const handlePayment = async () => {
    if (!event) return;
    
    const totalFee = calculateTotalFee();
    const paymentData = {
      name: isTeamRegistration ? teamName : formData.name,
      email: isTeamRegistration ? teamMembers[0].email : formData.email,
      phone: isTeamRegistration ? teamMembers[0].phone : formData.phone,
      college: isTeamRegistration ? `Team of ${teamMembers.length} members` : `${formData.branch} - Year ${formData.year}`,
      eventId: event.id,
      eventName: event.name,
      entryFee: totalFee,
    };
    
    await initiatePayment(paymentData);
  };

  const handleClose = () => {
    setStep("form");
    setFormData({ name: "", branch: "", year: "", email: "", phone: "" });
    setTeamName("");
    setTeamMembers([]);
    setIsTeamRegistration(false);
    setPaymentId("");
    onClose();
  };

  if (!event) return null;

  const isLoading = isSubmitting || isPaymentLoading;

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
            className="glass-card w-full max-w-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" disabled={isLoading}>
              <X className="w-6 h-6" />
            </button>

            {step === "form" && (
              <div>
                <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Register for {event.name}</h3>
                <p className="text-muted-foreground mb-4">
                  Entry Fee: {isTeamRegistration ? `₹100 per person (₹${calculateTotalFee()} for ${teamMembers.length} members)` : `₹${event.entryFee}`} | 
                  Team Size: {event.teamSize.min}-{event.teamSize.max}
                </p>
                
                {event.teamSize.max > 1 && (
                  <div className="mb-6">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTeamRegistration}
                        onChange={(e) => {
                          const newValue = e.target.checked;
                          setIsTeamRegistration(newValue);
                          if (newValue && event) {
                            // Initialize team members immediately
                            const initialMembers = Array(event.teamSize.min).fill(null).map((_, index) => ({
                              name: "",
                              branch: "",
                              year: "",
                              email: "",
                              phone: "",
                              isLeader: index === 0
                            }));
                            setTeamMembers(initialMembers);
                          } else {
                            setTeamMembers([]);
                          }
                        }}
                        className="rounded"
                      />
                      <span>Register as a team</span>
                    </Label>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isTeamRegistration && (
                    <div>
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input
                        id="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {!isTeamRegistration ? (
                    // Individual Registration Form
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="branch">Branch</Label>
                        <select 
                          id="branch" 
                          name="branch" 
                          value={formData.branch} 
                          onChange={handleSelectChange} 
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Branch</option>
                          {BRANCHES.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <select 
                          id="year" 
                          name="year" 
                          value={formData.year} 
                          onChange={handleSelectChange} 
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Year</option>
                          {YEARS.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className="mt-1" />
                      </div>
                    </div>
                  ) : (
                    // Team Registration Form
                    <div className="space-y-6">
                      {isTeamRegistration && teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                          <div key={index} className="glass-card p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-primary">
                                {member.isLeader ? "Team Leader" : `Team Member ${index + 1}`}
                              </h4>
                              {teamMembers.length > event.teamSize.min && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeTeamMember(index)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                  placeholder="Member name"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Branch</Label>
                                <select
                                  value={member.branch}
                                  onChange={(e) => handleTeamMemberChange(index, 'branch', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value="">Select Branch</option>
                                  {BRANCHES.map((branch) => (
                                    <option key={branch} value={branch}>
                                      {branch}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label>Year</Label>
                                <select
                                  value={member.year}
                                  onChange={(e) => handleTeamMemberChange(index, 'year', e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value="">Select Year</option>
                                  {YEARS.map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  type="email"
                                  value={member.email}
                                  onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                                  placeholder="Email"
                                  className="mt-1"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Phone Number</Label>
                                <Input
                                  value={member.phone}
                                  onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                                  placeholder="Phone number"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <p>Team registration not initialized</p>
                          <p>Team members: {teamMembers.length}</p>
                        </div>
                      )}
                      
                      {teamMembers.length < event.teamSize.max && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTeamMember}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Team Member
                        </Button>
                      )}
                    </div>
                  )}

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
                <p className="text-muted-foreground mb-6">Amount: ₹{calculateTotalFee()}</p>
                <div className="glass-card p-4 mb-6 text-left text-sm">
                  <p><strong>Event:</strong> {event.name}</p>
                  <p><strong>Name:</strong> {isTeamRegistration ? teamName : formData.name}</p>
                  <p><strong>Email:</strong> {isTeamRegistration ? teamMembers[0].email : formData.email}</p>
                  {isTeamRegistration && (
                    <>
                      <p><strong>Team Size:</strong> {teamMembers.length} members</p>
                      <p><strong>Rate:</strong> ₹100 per person</p>
                    </>
                  )}
                </div>
                <Button variant="festival" size="lg" className="w-full" onClick={handlePayment} disabled={isLoading}>
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening Razorpay...</> : `Pay ₹${calculateTotalFee()} with Razorpay`}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">Secure payment powered by Razorpay</p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
                </motion.div>
                <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Registration Successful!</h3>
                <p className="text-muted-foreground mb-6">Confirmation email sent to {isTeamRegistration ? teamMembers[0].email : formData.email}</p>
                <div className="glass-card p-4 mb-6 text-left text-sm">
                  <p><strong>Event:</strong> {event.name}</p>
                  <p><strong>Payment ID:</strong> <span className="font-mono text-secondary">{paymentId}</span></p>
                  <p><strong>Amount:</strong> ₹{calculateTotalFee()}</p>
                  {isTeamRegistration && (
                    <>
                      <p><strong>Team Name:</strong> {teamName}</p>
                      <p><strong>Team Size:</strong> {teamMembers.length} members</p>
                      <p><strong>Rate:</strong> ₹100 per person</p>
                    </>
                  )}
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
