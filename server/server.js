const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Health check (supports both /api/health and /health)
const healthHandler = (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    service: 'Organ Donor Registry API Service',
    timestamp: new Date().toISOString()
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API Routes (supports both /api/* and /* route paths)
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const organRoutes = require('./routes/organRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/donors', donorRoutes);
app.use('/donors', donorRoutes);

app.use('/api/organs', organRoutes);
app.use('/organs', organRoutes);

app.use('/api/requests', requestRoutes);
app.use('/requests', requestRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);

  res.status(500).json({
    success: false,
    message: 'Server Internal Error',
    error: err.message
  });
});

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Organ Donor Registry Backend listening on port ${PORT}`);
});