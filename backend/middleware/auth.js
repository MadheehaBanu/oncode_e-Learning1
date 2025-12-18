const jwt = require('jsonwebtoken');
const db = global.db;

const { admin } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  // Check session first
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // Check JWT token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify custom JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const userDoc = await db.collection('users').doc(decoded.userId).get();

    if (!userDoc.exists) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { id: decoded.userId, ...userDoc.data() };
    return next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const validateSession = (req, res, next) => {
  if (!req.session) {
    return res.status(500).json({ error: 'Session not available' });
  }
  next();
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole, validateSession };
