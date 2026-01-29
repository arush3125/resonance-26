import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { googleSheetsDirectService } from '@/services/googleSheetsDirect';
import { toast } from 'sonner';

export const GoogleSheetsDebugPanel = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testData, setTestData] = useState({
    name: 'Debug User',
    email: 'debug@example.com',
    phone: '1234567890',
    college: 'Debug College',
    branch: 'CS',
    year: '3',
    eventName: 'Debug Event'
  });

  const log = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const className = type === 'error' ? 'text-red-600' : type === 'success' ? 'text-green-600' : 'text-blue-600';
    console.log(`%c[${timestamp}] ${message}`, `color: ${className === 'text-red-600' ? 'red' : className === 'text-green-600' ? 'green' : 'blue'}`);
  };

  const testConnection = async () => {
    setIsTesting(true);
    log('🧪 Starting Google Sheets connection test...', 'info');
    
    try {
      const connectionTest = await googleSheetsDirectService.testConnection();
      
      if (connectionTest) {
        log('✅ Google Sheets connection successful!', 'success');
        toast.success('✅ Google Sheets connection successful!');
      } else {
        log('❌ Google Sheets connection failed', 'error');
        toast.error('❌ Google Sheets connection failed');
      }
    } catch (error) {
      log(`❌ Connection test error: ${error.message}`, 'error');
      toast.error(`❌ Connection test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testRegistration = async () => {
    setIsTesting(true);
    log('📝 Testing registration with sample data...', 'info');
    
    try {
      await googleSheetsDirectService.addRegistration({
        id: 'test-' + Date.now(),
        name: testData.name,
        email: testData.email,
        phone: testData.phone,
        college: testData.college,
        branch: testData.branch,
        year: testData.year,
        event_id: 'debug-event-' + Date.now(),
        event_name: testData.eventName,
        registration_type: 'solo',
        team_name: '',
        team_size: 1,
        entry_fee: 100,
        razorpay_payment_id: 'debug-payment-' + Date.now(),
        payment_status: 'success',
        created_at: new Date().toISOString()
      });
      
      log('✅ Test registration sent successfully!', 'success');
      toast.success('✅ Test registration sent! Check your Google Sheet.');
    } catch (error) {
      log(`❌ Registration test error: ${error.message}`, 'error');
      toast.error(`❌ Registration test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testDirectWebhook = async () => {
    setIsTesting(true);
    log('🌐 Testing direct webhook URL...', 'info');
    
    try {
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
      log(`📡 Testing direct URL: ${webhookUrl}`, 'info');
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'test',
          message: 'Direct test from debug panel',
          timestamp: new Date().toISOString()
        })
      });

      log(`📊 Direct response status: ${response.status}`, 'info');
      
      const responseText = await response.text();
      log(`📄 Direct response: ${responseText}`, 'info');

      if (response.ok) {
        log('✅ Direct test successful!', 'success');
        toast.success('✅ Direct webhook test successful!');
      } else {
        log(`❌ Direct test failed: ${response.status}`, 'error');
        toast.error(`❌ Direct webhook test failed: ${response.status}`);
      }
    } catch (error) {
      log(`❌ Direct test error: ${error.message}`, 'error');
      if (error.message.includes('CORS')) {
        log('🔍 This is expected due to CORS - proxy method should work', 'info');
        toast.warning('❌ Direct test failed (CORS expected) - use proxy method');
      } else {
        toast.error(`❌ Direct test failed: ${error.message}`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 w-96">
      <Card className="bg-white border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-blue-800">
            🔍 Google Sheets Debug Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Webhook URL:</strong><br/>
            <code className="break-all">
              {import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 'Not configured'}
            </code>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={testConnection}
              disabled={isTesting}
              variant="outline"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isTesting ? '🧪 Testing...' : '🧪 Test Connection'}
            </Button>
            
            <Button
              onClick={testRegistration}
              disabled={isTesting}
              variant="outline"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isTesting ? '📝 Testing...' : '📝 Test Registration'}
            </Button>
            
            <Button
              onClick={testDirectWebhook}
              disabled={isTesting}
              variant="outline"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isTesting ? '🌐 Testing...' : '🌐 Test Direct URL'}
            </Button>
          </div>

          <div className="border-t pt-3">
            <Label className="text-sm font-semibold">Test Data:</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={testData.name}
                  onChange={(e) => setTestData({...testData, name: e.target.value})}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input
                  value={testData.email}
                  onChange={(e) => setTestData({...testData, email: e.target.value})}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input
                  value={testData.phone}
                  onChange={(e) => setTestData({...testData, phone: e.target.value})}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Event</Label>
                <Input
                  value={testData.eventName}
                  onChange={(e) => setTestData({...testData, eventName: e.target.value})}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
            💡 <strong>Instructions:</strong><br/>
            1. Start with "Test Connection"<br/>
            2. Check browser console for logs<br/>
            3. Check your Google Sheet for data<br/>
            4. Use "Test Registration" to send sample data
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
