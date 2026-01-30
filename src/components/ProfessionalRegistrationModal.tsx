import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, CheckCircle, Loader2, Plus, Trash2, Users, User, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/data/festivalData";
import { toast } from "sonner";
import { registrationAPI } from "@/services/registrationAPI";
import { useRazorpayDirect } from "@/hooks/useRazorpayDirect";

interface Participant {
  name: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
}

interface RegistrationData {
  type: "solo" | "team";
  eventId: string;
  participant?: Participant;
  teamName?: string;
  leader?: Participant;
  members?: Participant[];
  totalMembers?: number;
  amount: number;
  payment?: {
    order_id: string;
    payment_id: string;
    status: string;
  };
  timestamp?: string;
}

interface ProfessionalRegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const YEARS = ["2K", "4K", "6K"];
const BRANCHES = ["AN", "TE", "ME", "CE", "AE"];

export const ProfessionalRegistrationModal = ({ event, isOpen, onClose }: ProfessionalRegistrationModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationType, setRegistrationType] = useState<"solo" | "team" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  // Solo registration state
  const [soloData, setSoloData] = useState<Participant>({
    name: "",
    branch: "",
    year: "",
    email: "",
    phone: "",
  });

  // Team registration state
  const [teamName, setTeamName] = useState("");
  const [numberOfMembers, setNumberOfMembers] = useState(2);
  const [teamLeader, setTeamLeader] = useState<Participant>({
    name: "",
    branch: "",
    year: "",
    email: "",
    phone: "",
  });
  const [teamMembers, setTeamMembers] = useState<Participant[]>([]);

  // Auto-detect registration type based on event
  useEffect(() => {
    if (event) {
      if (event.teamSize.max === 1) {
        // Solo-only event
        setRegistrationType("solo");
      } else if (event.teamSize.min > 1) {
        // Team-only event (minimum team size > 1)
        setRegistrationType("team");
        // Set default number of members to minimum required
        setNumberOfMembers(event.teamSize.min);
      } else {
        // Flexible event (can be solo or team) - let user choose
        setRegistrationType(null);
      }
    }
  }, [event]);

  // Initialize team members when number changes
  useEffect(() => {
    if (registrationType === "team" && numberOfMembers > 0) {
      const members = Array(numberOfMembers).fill(null).map(() => ({
        name: "",
        branch: "",
        year: "",
        email: "",
        phone: "",
      }));
      setTeamMembers(members);
    }
  }, [numberOfMembers, registrationType]);

  // Calculate total amount
  const calculateAmount = () => {
    if (registrationType === "solo") {
      return 100;
    } else if (registrationType === "team") {
      const totalParticipants = 1 + numberOfMembers; // leader + members
      return totalParticipants * 100;
    }
    return 0;
  };

  // Validation functions
  const validateSoloData = (): boolean => {
    return !!(soloData.name && soloData.branch && soloData.year && soloData.email && soloData.phone);
  };

  const validateTeamInfo = (): boolean => {
    return !!(teamName && numberOfMembers >= 2);
  };

  const validateTeamLeader = (): boolean => {
    return !!(teamLeader.name && teamLeader.branch && teamLeader.year && teamLeader.email && teamLeader.phone);
  };

  const validateTeamMembers = (): boolean => {
    return teamMembers.every(member => 
      member.name && member.branch && member.year && member.email && member.phone
    );
  };

  const canProceedToPayment = (): boolean => {
    if (registrationType === "solo") {
      return validateSoloData();
    } else if (registrationType === "team") {
      return validateTeamInfo() && validateTeamLeader() && validateTeamMembers();
    }
    return false;
  };

  // Handle team member changes
  const handleTeamMemberChange = (index: number, field: keyof Participant, value: string) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);
  };

  // Razorpay integration
  const razorpayHook = useRazorpayDirect({
    onSuccess: async (razorpayPaymentId) => {
      setPaymentId(razorpayPaymentId);
      await saveRegistrationData(razorpayPaymentId);
      setCurrentStep(4); // Success step
      toast.success("Payment successful!");
    },
    onFailure: (error) => {
      toast.error(error || "Payment failed");
    },
  });

  // Use Razorpay payment hook
  const { initiatePayment, isLoading: isPaymentLoading } = razorpayHook;

  const handlePayment = async () => {
    if (!event) return;

    const amount = calculateAmount();
    const paymentData = {
      name: registrationType === "solo" ? soloData.name : teamName,
      email: registrationType === "solo" ? soloData.email : teamLeader.email,
      phone: registrationType === "solo" ? soloData.phone : teamLeader.phone,
      college: registrationType === "solo" 
        ? `${soloData.branch} - Year ${soloData.year}`
        : `Team: ${teamName}`,
      eventId: event.id,
      eventName: event.name,
      entryFee: amount,
    };

    await initiatePayment(paymentData);
  };

  const saveRegistrationData = async (paymentId: string) => {
    if (!event) return;

    try {
      // Format data for existing database schema
      // Prepare data for backend API
      const apiData = {
        name: registrationType === "solo" ? soloData.name : teamLeader.name,
        branch: registrationType === "solo" ? soloData.branch : teamLeader.branch,
        year: registrationType === "solo" ? soloData.year : teamLeader.year,
        email: registrationType === "solo" ? soloData.email : teamLeader.email,
        phone: registrationType === "solo" ? soloData.phone : teamLeader.phone,
        eventName: event.name,
        teamName: registrationType === "team" ? teamName : undefined,
        registrationType: registrationType as "solo" | "team",
        numberOfParticipants: registrationType === "team" ? 1 + numberOfMembers : 1,
        amountPaid: calculateAmount(),
        razorpayPaymentId: paymentId,
        paymentStatus: "success"
      };

      console.log('📤 Sending registration to backend:', apiData);

      // Save to backend with retry mechanism
      await registrationAPI.saveRegistrationWithRetry(apiData, 3);
      
      console.log('✅ Registration saved successfully!');
      toast.success("Registration saved successfully!");
    } catch (error) {
      console.error("Error saving registration:", error);
      toast.error("Error saving registration data");
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setRegistrationType(null);
    setSoloData({ name: "", branch: "", year: "", email: "", phone: "" });
    setTeamName("");
    setNumberOfMembers(2);
    setTeamLeader({ name: "", branch: "", year: "", email: "", phone: "" });
    setTeamMembers([]);
    setPaymentId("");
    onClose();
  };

  const renderStep = () => {
    // Auto-skip registration type selection for solo-only or team-only events
    if (registrationType === "solo" && currentStep === 1) {
      setCurrentStep(2);
      return renderSoloForm();
    }
    
    if (registrationType === "team" && currentStep === 1) {
      setCurrentStep(2);
      return renderTeamInfo();
    }
    
    switch (currentStep) {
      case 1:
        return renderRegistrationType();
      case 2:
        return registrationType === "solo" ? renderSoloForm() : renderTeamInfo();
      case 3:
        return registrationType === "solo" ? renderSoloReview() : renderTeamDetails();
      case 4:
        return renderSuccess();
      default:
        return null;
    }
  };

  const renderRegistrationType = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-2xl font-orbitron font-bold gradient-text mb-6">Choose Registration Type</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setRegistrationType("solo")}
          className={`p-6 rounded-2xl border-2 transition-all ${
            registrationType === "solo"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
        >
          <User className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h4 className="text-xl font-bold mb-2">Solo Registration</h4>
          <p className="text-muted-foreground text-sm">Register individually for the event</p>
          <p className="text-primary font-semibold mt-2">Fee: ₹100</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setRegistrationType("team")}
          className={`p-6 rounded-2xl border-2 transition-all ${
            registrationType === "team"
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50"
          }`}
          disabled={event?.teamSize.max === 1}
        >
          <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h4 className="text-xl font-bold mb-2">Team Registration</h4>
          <p className="text-muted-foreground text-sm">Register as a team</p>
          <p className="text-primary font-semibold mt-2">
            Fee: ₹100 × participants
          </p>
          {event?.teamSize.max === 1 && (
            <p className="text-xs text-muted-foreground mt-2">Not available for this event</p>
          )}
        </motion.button>
      </div>

      <Button
        variant="festival"
        size="lg"
        className="w-full"
        onClick={() => setCurrentStep(2)}
        disabled={!registrationType}
      >
        Continue
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );

  const renderSoloForm = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Solo Registration</h3>
      <p className="text-muted-foreground mb-6">Fill in your details to register for {event?.name}</p>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="soloName">Full Name</Label>
          <Input
            id="soloName"
            value={soloData.name}
            onChange={(e) => setSoloData({ ...soloData, name: e.target.value })}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="soloBranch">Branch</Label>
          <select
            id="soloBranch"
            value={soloData.branch}
            onChange={(e) => setSoloData({ ...soloData, branch: e.target.value })}
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
          <Label htmlFor="soloYear">Year</Label>
          <select
            id="soloYear"
            value={soloData.year}
            onChange={(e) => setSoloData({ ...soloData, year: e.target.value })}
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
          <Label htmlFor="soloEmail">Email</Label>
          <Input
            id="soloEmail"
            type="email"
            value={soloData.email}
            onChange={(e) => setSoloData({ ...soloData, email: e.target.value })}
            placeholder="your.email@example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="soloPhone">Contact Number</Label>
          <Input
            id="soloPhone"
            value={soloData.phone}
            onChange={(e) => setSoloData({ ...soloData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="festival"
          onClick={() => setCurrentStep(3)}
          className="flex-1"
          disabled={!validateSoloData()}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderTeamInfo = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Team Information</h3>
      <p className="text-muted-foreground mb-6">Provide your team details</p>

      <div className="space-y-4 mb-6">
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

        <div>
          <Label htmlFor="memberCount">Number of Team Members</Label>
          <Input
            id="memberCount"
            type="number"
            min={2}
            max={event?.teamSize.max || 4}
            value={numberOfMembers}
            onChange={(e) => setNumberOfMembers(Math.max(2, Math.min(event?.teamSize.max || 4, parseInt(e.target.value) || 2)))}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum: 2, Maximum: {event?.teamSize.max || 4} members
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="festival"
          onClick={() => setCurrentStep(3)}
          className="flex-1"
          disabled={!validateTeamInfo()}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderTeamDetails = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-2xl font-orbitron font-bold gradient-text mb-6">Team Member Details</h3>

      {/* Team Leader Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Team Leader Details
        </h4>
        <div className="glass-card p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={teamLeader.name}
                onChange={(e) => setTeamLeader({ ...teamLeader, name: e.target.value })}
                placeholder="Leader's full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Branch</Label>
              <select
                value={teamLeader.branch}
                onChange={(e) => setTeamLeader({ ...teamLeader, branch: e.target.value })}
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
                value={teamLeader.year}
                onChange={(e) => setTeamLeader({ ...teamLeader, year: e.target.value })}
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
                value={teamLeader.email}
                onChange={(e) => setTeamLeader({ ...teamLeader, email: e.target.value })}
                placeholder="Email"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Contact Number</Label>
              <Input
                value={teamLeader.phone}
                onChange={(e) => setTeamLeader({ ...teamLeader, phone: e.target.value })}
                placeholder="Phone number"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Members ({numberOfMembers})
        </h4>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="glass-card p-4">
              <h5 className="font-medium mb-3">Team Member {index + 1}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                    placeholder="Member's full name"
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
                  <Label>Contact Number</Label>
                  <Input
                    value={member.phone}
                    onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                    placeholder="Phone number"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Display */}
      <div className="glass-card p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Payable Amount:</span>
          <span className="text-2xl font-bold text-primary">₹{calculateAmount()}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          ₹100 × {1 + numberOfMembers} participants (1 leader + {numberOfMembers} members)
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="festival"
          onClick={handlePayment}
          className="flex-1"
          disabled={!canProceedToPayment() || isPaymentLoading}
        >
          {isPaymentLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ₹{calculateAmount()}
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );

  const renderSoloReview = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="text-2xl font-orbitron font-bold gradient-text mb-6">Review Your Details</h3>

      <div className="glass-card p-6 mb-6">
        <h4 className="font-semibold text-primary mb-4">Participant Information</h4>
        <div className="space-y-3">
          <div><strong>Name:</strong> {soloData.name}</div>
          <div><strong>Branch:</strong> {soloData.branch}</div>
          <div><strong>Year:</strong> {soloData.year}</div>
          <div><strong>Email:</strong> {soloData.email}</div>
          <div><strong>Phone:</strong> {soloData.phone}</div>
        </div>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Registration Fee:</span>
          <span className="text-2xl font-bold text-primary">₹100</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          variant="festival"
          onClick={handlePayment}
          className="flex-1"
          disabled={!validateSoloData() || isPaymentLoading}
        >
          {isPaymentLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ₹100
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
        </motion.div>
        <h3 className="text-2xl font-orbitron font-bold gradient-text mb-2">Registration Successful!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for registering for {event?.name}
        </p>
        
        <div className="glass-card p-4 mb-6 text-left text-sm">
          <p><strong>Event:</strong> {event?.name}</p>
          <p><strong>Payment ID:</strong> <span className="font-mono text-secondary">{paymentId}</span></p>
          <p><strong>Amount Paid:</strong> ₹{calculateAmount()}</p>
          {registrationType === "team" && (
            <>
              <p><strong>Team Name:</strong> {teamName}</p>
              <p><strong>Team Size:</strong> {1 + numberOfMembers} participants</p>
            </>
          )}
          <p><strong>Registration Type:</strong> {registrationType === "solo" ? "Solo" : "Team"}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Confirmation email has been sent to your registered email address.
        </p>

        <Button variant="festivalOutline" size="lg" onClick={handleClose}>
          Close
        </Button>
      </div>
    </motion.div>
  );

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
            className="glass-card w-full max-w-4xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" disabled={isLoading}>
              <X className="w-6 h-6" />
            </button>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {(registrationType === "solo" && event?.teamSize.max === 1) || 
                 (registrationType === "team" && event?.teamSize.min > 1) ? (
                  // Solo-only or team-only events: show 3 steps (Details, Review, Success)
                  [2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          step <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step < currentStep ? "✓" : step - 1}
                      </div>
                      {step < 4 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-colors ${
                            step < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  // Flexible events: show 4 steps
                  [1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          step <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step < currentStep ? "✓" : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-colors ${
                            step < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                {(registrationType === "solo" && event?.teamSize.max === 1) || 
                 (registrationType === "team" && event?.teamSize.min > 1) ? (
                  <>
                    <span>Details</span>
                    <span>Review</span>
                    <span>Success</span>
                  </>
                ) : (
                  <>
                    <span>Type</span>
                    <span>Details</span>
                    <span>Review</span>
                    <span>Success</span>
                  </>
                )}
              </div>
            </div>

            {renderStep()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
