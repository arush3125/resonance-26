import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Enable CORS for all origins (for testing)
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Simple health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple test endpoint
app.post('/api/registration', (req, res) => {
  console.log('Received data:', req.body);
  res.json({
    success: true,
    message: 'Test endpoint working - Google Sheets integration would go here',
    received: req.body
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Registration endpoint: http://localhost:${PORT}/api/registration`);
  console.log(`🌐 CORS enabled for all origins`);
});

export default app;
