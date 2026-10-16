require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const triageRoutes = require('./routes/triage');
const riskRoutes = require('./routes/risk');
const reportsRoutes = require('./routes/reports');
const clinicianRoutes = require('./routes/clinician');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Increased limit for OCR image payloads
app.use(express.json({ limit: '10mb' }));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/clinician', clinicianRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NexAI API', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

app.listen(PORT, () => {
  console.log(`🚀 NexAI Server running on http://localhost:${PORT}`);
  console.log(`Database connected in WAL mode.`);
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your-key-here') {
    console.warn(`⚠️  WARNING: DEEPSEEK_API_KEY is not set. Triage service will return mock responses.`);
  }
});
