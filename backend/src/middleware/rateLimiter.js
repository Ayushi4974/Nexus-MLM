const rateLimit = require('express-rate-limit');

/**
 * Apply a global rate limit. Threshold can be overridden via env var.
 * Defaults to 100 requests per minute per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter };
