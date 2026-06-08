const jwt = require('jsonwebtoken');

// Access token (short lived, 1 hour)
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretkey_mlm_2026', {
    expiresIn: '1h',
  });
}

// Refresh token (long lived, 7 days)
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_2026', {
    expiresIn: '7d',
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_mlm_2026');
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_2026');
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
