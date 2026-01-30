# Resonance Registration Backend

A simple Node.js backend for storing registration data to Google Sheets, completely replacing Supabase.

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Sheet with these columns in order:
   - Timestamp
   - Name
   - Branch
   - Year
   - Email
   - Phone
   - Event Name
   - Team Name
   - Registration Type
   - Number of Participants
   - Amount Paid
   - Razorpay Payment ID
   - Payment Status

2. Get the Spreadsheet ID from the URL (e.g., `1abc123def456ghi789` from `https://docs.google.com/spreadsheets/d/1abc123def456ghi789/edit`)

### 2. Google Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create Service Account credentials
5. Download JSON key file and save as `service-account.json` in this directory
6. Share your Google Sheet with the service account email (give it Editor access)

### 3. Environment Setup

1. Copy `.env.example` to `.env`
2. Update the values:
   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=your_actual_spreadsheet_id
   GOOGLE_SHEETS_RANGE=Sheet1!A:L
   GOOGLE_SERVICE_ACCOUNT_PATH=./service-account.json
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

### 4. Install Dependencies

```bash
cd server
npm install
```

### 5. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/registration

Stores registration data in Google Sheets.

**Request Body:**
```json
{
  "name": "John Doe",
  "branch": "Computer Science",
  "year": "3",
  "email": "john@example.com",
  "phone": "1234567890",
  "eventName": "Tech Quiz",
  "teamName": "Team A",
  "registrationType": "team",
  "numberOfParticipants": 3,
  "amountPaid": 300,
  "razorpayPaymentId": "pay_1234567890",
  "paymentStatus": "success"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration saved successfully",
  "data": {
    "spreadsheetId": "1abc123def456ghi789",
    "updatedRange": "Sheet1!A:L",
    "processingTime": "245ms"
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sheetsInitialized": true,
  "environment": "development"
}
```

## Features

- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Input validation
- ✅ CORS protection
- ✅ Error logging
- ✅ Processing time tracking
- ✅ Health monitoring
- ✅ Production-ready security headers

## Security

- Uses Helmet.js for security headers
- Rate limiting prevents abuse
- Input validation prevents bad data
- CORS restricts to frontend domain
- No sensitive data in logs

## Error Handling

All errors return structured JSON responses:
```json
{
  "success": false,
  "message": "Error description",
  "processingTime": "123ms"
}
```

## Monitoring

Check server logs for:
- Registration attempts
- Success/failure rates
- Processing times
- Error details
