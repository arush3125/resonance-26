# Google Apps Script Troubleshooting Checklist

## 🚨 Issue: Success message but no data in Google Sheet

### Step 1: Verify Google Apps Script Deployment

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/1giL91m3QZVPDpzxNG1zlCcyi0Nvulc-cl7FwiGOQsqo

2. **Go to Extensions > Apps Script**

3. **Check the code**: Make sure it has the updated code with CORS headers:
   ```javascript
   function doPost(e) {
     // Should have CORS handling
     return createCORSResponse(result);
   }
   
   function createCORSResponse(data) {
     // Should have these headers:
     response.setHeader('Access-Control-Allow-Origin', '*');
     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
     response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
   }
   ```

4. **Check Deployments**:
   - Click "Deploy" > "Deployments"
   - You should see your deployment
   - The URL should match: `https://script.google.com/macros/s/AKfycbzRstXQ6DqsASHJjPr8QPyUMtqSjqNemh0x0z8RM0tpF1_i4sEoFflCsYLp19rhqvdW/exec`

### Step 2: Redeploy if Necessary

1. **Click "Deploy" > "New deployment"**
2. **Select**: Web app
3. **Description**: "RESONANCE Festival Registration"
4. **Execute as**: Me (your Google account)
5. **Who has access**: Anyone
6. **Click "Deploy"**
7. **Copy the new Web app URL**
8. **Update your .env file** with the new URL

### Step 3: Test the Script Directly

1. **In Apps Script editor**, click "Run" > "testFunction"
2. **Check the execution logs**: Click "Executions" tab
3. **Look for errors** in the logs

### Step 4: Verify Sheet Structure

1. **Check if sheets exist**:
   - `Registrations`
   - `TeamMembers` 
   - `Auditions`

2. **Check headers** in `Registrations` sheet:
   ```
   Name | Email | Phone | College | Branch | Year | Event ID | Event Name | Registration Type | Team Name | Team Size | Entry Fee | Payment ID | Payment Status | Created At | Timestamp
   ```

### Step 5: Manual Test

1. **Open browser console** (F12)
2. **Copy and paste** the content of `check-google-script.js`
3. **Press Enter** to run the tests
4. **Check your Google Sheet** after 30 seconds

### Step 6: Common Issues & Solutions

#### Issue 1: Script Not Updated
**Solution**: Redeploy the script with new code

#### Issue 2: Wrong Permissions
**Solution**: 
- Redeploy with "Anyone" access
- Make sure "Execute as" is set to "Me"

#### Issue 3: Multiple Deployments
**Solution**: 
- Delete old deployments
- Keep only the latest one

#### Issue 4: Sheet Not Created
**Solution**: 
- Run `initializeSheets()` function manually
- Check if sheets appear

#### Issue 5: Data Format Issue
**Solution**: 
- Check the data array length (should be 16 columns)
- Make sure all data is string format

### Step 7: Debug the Request

1. **Use the debug panel** on your website
2. **Check browser console** for detailed logs
3. **Look for these messages**:
   - 📡 Sending webhook request to: ...
   - 📦 Payload: {...}
   - 📊 Response status: 200
   - ✅ Registration data sent to Google Sheets successfully

### Step 8: Alternative Test

If the above doesn't work, try this:

1. **Create a new test sheet**: https://sheets.new
2. **Copy the sheet ID** from the URL
3. **Update the Apps Script** to use the new sheet
4. **Test with the new sheet**

### Step 9: Check Google Apps Script Limits

- **Daily quota**: 20,000 read/write operations
- **Execution time**: 6 minutes per execution
- **Requests**: 20,000 per day

### Step 10: Contact Support

If nothing works:
1. **Check Google Apps Script status**: https://status.cloud.google.com/
2. **Try a different Google account**
3. **Check if your organization blocks Google Apps Script**

---

## 🧪 Quick Test Commands

In browser console:
```javascript
// Test basic connection
fetch('https://script.google.com/macros/s/AKfycbzRstXQ6DqsASHJjPr8QPyUMtqSjqNemh0x0z8RM0tpF1_i4sEoFflCsYLp19rhqvdW/exec', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({type: 'test', message: 'Manual test'}),
  mode: 'no-cors'
}).then(() => console.log('✅ Request sent')).catch(e => console.error('❌ Error:', e));
```

---

## 📊 Expected Results

When working correctly:
- ✅ Console shows success messages
- ✅ New rows appear in Google Sheet within 10 seconds
- ✅ Toast notifications show success
- ✅ No CORS errors in console

If you see success messages but no data, the issue is likely in the Google Apps Script deployment or permissions.
