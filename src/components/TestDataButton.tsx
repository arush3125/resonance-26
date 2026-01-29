import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RegistrationData, TeamMemberData } from "@/types/registration";

export const TestDataButton = () => {
  const addTestData = () => {
    try {
      // Create test registration data
      const testRegistration: RegistrationData = {
        name: "Test User " + Date.now(),
        email: "test@example.com",
        phone: "+91 9876543210",
        college: "Computer Science - Year 3",
        event_id: "test-event",
        event_name: "Test Event",
        entry_fee: 100,
        razorpay_payment_id: "test_pay_" + Date.now(),
        payment_status: "success",
        registration_type: "solo",
        team_name: undefined,
        team_size: 1,
        created_at: new Date().toISOString(),
      };

      // Save to localStorage
      const existingData = JSON.parse(localStorage.getItem('registrationData') || '[]');
      existingData.push(testRegistration);
      localStorage.setItem('registrationData', JSON.stringify(existingData));

      console.log('✅ Test registration added:', testRegistration);
      console.log('📊 Total registrations in localStorage:', existingData.length);

      toast.success(`Test data added! Total: ${existingData.length} registrations`);

      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      console.error('❌ Failed to add test data:', error);
      toast.error('Failed to add test data');
    }
  };

  const clearData = () => {
    localStorage.removeItem('registrationData');
    localStorage.removeItem('teamMemberData');
    toast.success('All data cleared');
    window.dispatchEvent(new Event('storage'));
  };

  const checkData = () => {
    const registrations = JSON.parse(localStorage.getItem('registrationData') || '[]');
    const teamMembers = JSON.parse(localStorage.getItem('teamMemberData') || '[]');
    
    console.log('📊 Current registrations:', registrations.length);
    console.log('👥 Current team members:', teamMembers.length);
    console.log('📋 Registration data:', registrations);
    
    alert(`Registrations: ${registrations.length}\nTeam Members: ${teamMembers.length}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button onClick={addTestData} className="bg-green-500 hover:bg-green-600">
        Add Test Data
      </Button>
      <Button onClick={checkData} className="bg-blue-500 hover:bg-blue-600">
        Check Data
      </Button>
      <Button onClick={clearData} className="bg-red-500 hover:bg-red-600">
        Clear Data
      </Button>
    </div>
  );
};
