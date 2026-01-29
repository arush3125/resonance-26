import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { googleSheetsDirectService } from '@/services/googleSheetsDirect';
import { toast } from 'sonner';

export const GoogleSheetsTestButton = () => {
  const [isTesting, setIsTesting] = useState(false);

  const testGoogleSheets = async () => {
    setIsTesting(true);
    
    try {
      console.log('🧪 Starting Google Sheets connection test...');
      
      // Test basic connection
      const connectionTest = await googleSheetsDirectService.testConnection();
      
      if (connectionTest) {
        toast.success('✅ Google Sheets connection successful!');
        
        // Test with sample data
        await googleSheetsDirectService.addRegistration({
          id: 'test-' + Date.now(),
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          college: 'Test College',
          branch: 'Computer Science',
          year: '3',
          event_id: 'test-event',
          event_name: 'Test Event',
          registration_type: 'solo',
          team_name: '',
          team_size: 1,
          entry_fee: 100,
          razorpay_payment_id: 'test-payment-' + Date.now(),
          payment_status: 'success',
          created_at: new Date().toISOString()
        });
        
        toast.success('✅ Test data sent to Google Sheets!');
      } else {
        toast.error('❌ Google Sheets connection failed');
      }
      
    } catch (error) {
      console.error('❌ Google Sheets test error:', error);
      toast.error(`❌ Google Sheets test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={testGoogleSheets}
        disabled={isTesting}
        variant="outline"
        size="sm"
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        {isTesting ? '🧪 Testing...' : '🧪 Test Google Sheets'}
      </Button>
    </div>
  );
};
