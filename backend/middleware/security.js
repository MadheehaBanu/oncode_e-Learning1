const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting
const createRateLimit = (windowMs, max) => rateLimit({
  windowMs,
  max,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// Input validation
const validateInput = (req, res, next) => {
  // Basic XSS protection
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

module.exports = {
  authLimiter: createRateLimit(15 * 60 * 1000, 5), // 5 attempts per 15 minutes
  generalLimiter: createRateLimit(15 * 60 * 1000, 100), // 100 requests per 15 minutes
  securityHeaders,
  validateInput
};