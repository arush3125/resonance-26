import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Google Sheets setup
let sheets;
try {
  const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || join(__dirname, 'service-account.json');
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  
  sheets = google.sheets({ version: 'v4', auth });
  console.log('✅ Google Sheets API initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Google Sheets API:', error.message);
  console.log('📝 Please ensure service-account.json exists with proper credentials');
}

// Validation helper
const validateRegistrationData = (data) => {
  const required = ['name', 'email', 'phone', 'eventName', 'registrationType', 'amountPaid', 'razorpayPaymentId'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }
  
  // Phone validation (basic)
  if (data.phone.length < 10) {
    throw new Error('Phone number must be at least 10 digits');
  }
};

// Main registration endpoint
app.post('/api/registration', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('📝 Received registration request:', {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const registrationData = req.body;
    
    // Validate input
    validateRegistrationData(registrationData);
    
    if (!sheets) {
      throw new Error('Google Sheets API not initialized');
    }

    // Prepare row data for Google Sheets
    const rowData = [
      new Date().toISOString(), // Timestamp
      registrationData.name || '',
      registrationData.branch || '',
      registrationData.year || '',
      registrationData.email || '',
      registrationData.phone || '',
      registrationData.eventName || '',
      registrationData.teamName || '',
      registrationData.registrationType || '',
      registrationData.numberOfParticipants || 1,
      registrationData.amountPaid || 0,
      registrationData.razorpayPaymentId || '',
      registrationData.paymentStatus || 'success'
    ];

    // Append to Google Sheets
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A:L';
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [rowData]
      }
    });

    const processingTime = Date.now() - startTime;
    
    console.log('✅ Registration saved successfully:', {
      spreadsheetId,
      updatedRange: response.data.updates?.updatedRange,
      processingTime: `${processingTime}ms`
    });

    res.status(200).json({
      success: true,
      message: 'Registration saved successfully',
      data: {
        spreadsheetId,
        updatedRange: response.data.updates?.updatedRange,
        processingTime: `${processingTime}ms`
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('❌ Registration failed:', {
      error: error.message,
      stack: error.stack,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

    res.status(400).json({
      success: false,
      message: error.message,
      processingTime: `${processingTime}ms`
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    sheetsInitialized: !!sheets,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Registration server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Registration endpoint: http://localhost:${PORT}/api/registration`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
