const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'organ_donor_secret_key_jwt_token_2026_super_secure');

      // Try fetching user from DB if available
      if (mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (err) {
          req.user = decoded;
        }
      }

      if (!req.user) {
        req.user = decoded;
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'organ_donor_secret_key_jwt_token_2026_super_secure');

      if (mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (err) {
          req.user = decoded;
        }
      }

      if (!req.user) {
        req.user = decoded;
      }
    } catch (error) {
      // optional auth failed silently
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
