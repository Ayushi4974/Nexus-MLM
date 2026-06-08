const asyncHandler = require('express-async-handler');
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require('../services/tokenService');
const { User } = require('../../models');

/**
 * @desc Refresh access token using a valid refresh token
 * @route POST /api/auth/refresh
 * @access Public (but requires valid refresh token)
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token required' });
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    const newAccess = generateAccessToken(user._id);
    const newRefresh = generateRefreshToken(user._id);
    res.json({ success: true, data: { accessToken: newAccess, refreshToken: newRefresh } });
  } catch (err) {
    console.error('Refresh token error:', err);
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

module.exports = { refreshToken };
