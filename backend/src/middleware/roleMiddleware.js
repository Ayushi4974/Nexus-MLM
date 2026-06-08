const asyncHandler = require('express-async-handler');

/**
 * Middleware to allow only admin users.
 * Assumes req.user is set by protect middleware.
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    return next();
  }
  res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
});

module.exports = { protectAdmin };
