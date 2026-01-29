/**
 * Simple test to verify Google Apps Script is working
 * Run this in your browser console on any page
 */

// Test the webhook directly
async function testGoogleScript() {
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbzRstXQ6DqsASHJjPr8QPyUMtqSjqNemh0x0z8RM0tpF1_i4sEoFflCsYLp19rhqvdW/exec';
    
    console.log('🧪 Testing Google Apps Script directly...');
    
    const testData = {
        type: 'test',
        message: 'Direct test from browser',
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
            mode: 'no-cors' // This will help us see if the request is being sent
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', [...response.headers.entries()]);
        
        // Try to get response text
        const responseText = await response.text();
        console.log('📄 Response text:', responseText);
        
    } catch (error) {
        console.error('❌ Error:', error);
        
        // Try with no-cors mode
        console.log('🔄 Trying with no-cors mode...');
        
        try {
            const noCorsResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
                mode: 'no-cors'
            });
            
            console.log('✅ No-cors request sent (opaque response)');
            console.log('📊 No-cors response type:', noCorsResponse.type);
            
        } catch (noCorsError) {
            console.error('❌ No-cors also failed:', noCorsError);
        }
    }
}

// Test with a simple GET request
async function testGetRequest() {
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbzRstXQ6DqsASHJjPr8QPyUMtqSjqNemh0x0z8RM0tpF1_i4sEoFflCsYLp19rhqvdW/exec';
    
    console.log('🌐 Testing GET request...');
    
    try {
        const response = await fetch(webhookUrl + '?test=true', {
            method: 'GET',
            mode: 'no-cors'
        });
        
        console.log('✅ GET request sent');
        console.log('📊 GET response type:', response.type);
        
    } catch (error) {
        console.error('❌ GET request failed:', error);
    }
}

// Test registration data
async function testRegistrationData() {
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbzRstXQ6DqsASHJjPr8QPyUMtqSjqNemh0x0z8RM0tpF1_i4sEoFflCsYLp19rhqvdW/exec';
    
    console.log('📝 Testing registration data...');
    
    const registrationData = {
        type: 'registration',
        sheet: 'Registrations',
        data: [
            'Test User ' + Date.now(),
            'test@example.com',
            '1234567890',
            'Test College',
            'CS',
            '3',
            'test-event-' + Date.now(),
            'Test Event',
            'solo',
            '',
            1,
            100,
            'test-payment-' + Date.now(),
            'success',
            new Date().toISOString(),
            new Date().toLocaleString()
        ]
    };
    
    console.log('📋 Registration data:', registrationData);
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
            mode: 'no-cors'
        });
        
        console.log('✅ Registration data sent');
        console.log('📊 Registration response type:', response.type);
        
    } catch (error) {
        console.error('❌ Registration data failed:', error);
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Google Apps Script tests...');
    
    testGoogleScript();
    setTimeout(testGetRequest, 1000);
    setTimeout(testRegistrationData, 2000);
    
    console.log('⏱️ Tests scheduled. Check your Google Sheet in 30 seconds.');
}

// Auto-run
runAllTests();

// Also expose functions for manual testing
window.testGoogleScript = testGoogleScript;
window.testGetRequest = testGetRequest;
window.testRegistrationData = testRegistrationData;
window.runAllTests = runAllTests;

console.log('🔧 Google Script test functions loaded. You can run them manually:');
console.log('- testGoogleScript()');
console.log('- testGetRequest()');
console.log('- testRegistrationData()');
console.log('- runAllTests()');
