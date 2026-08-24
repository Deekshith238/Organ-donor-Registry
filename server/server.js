const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// DATABASE CONNECTION
// =====================================================

connectDB();

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    service: 'Organ Donor Registry API Service',
    timestamp: new Date().toISOString()
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/organs', require('./routes/organRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);

  res.status(500).json({
    success: false,
    message: 'Server Internal Error',
    error: err.message
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Organ Donor Registry Backend listening on port ${PORT}`);
  console.log(`📡 API Base Endpoint: http://localhost:${PORT}/api`);
});
