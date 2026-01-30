# Quick Setup Guide

## 1. Google Sheets Setup (5 minutes)

1. **Create Google Sheet** with these columns in order:
   ```
   Timestamp | Name | Branch | Year | Email | Phone | Event Name | Team Name | Registration Type | Number of Participants | Amount Paid | Razorpay Payment ID | Payment Status
   ```

2. **Get Spreadsheet ID** from URL:
   - URL: `https://docs.google.com/spreadsheets/d/1abc123def456ghi789/edit`
   - ID: `1abc123def456ghi789`

3. **Create Google Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sheets API
   - Create Service Account
   - Download JSON key as `service-account.json`
   - Share your Google Sheet with service account email (Editor access)

## 2. Update Server Configuration

Edit `server/.env`:
```
GOOGLE_SHEETS_SPREADSHEET_ID=your_actual_spreadsheet_id
```

## 3. Start Backend Server

```bash
cd server
npm run dev
```

Server will run on: http://localhost:3001

## 4. Test API

```bash
curl -X POST http://localhost:3001/api/registration \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "eventName": "Test Event",
    "registrationType": "solo",
    "numberOfParticipants": 1,
    "amountPaid": 100,
    "razorpayPaymentId": "test_payment_123",
    "paymentStatus": "success"
  }'
```

## 5. Check Results

- Check your Google Sheet for new row
- Check server logs for success message

## Frontend Integration

The frontend is already configured to call this backend API. Just ensure:
- Backend server is running on port 3001
- Environment variables are set correctly
