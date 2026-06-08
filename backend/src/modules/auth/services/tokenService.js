const jwt = require('jsonwebtoken');

class TokenService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'supersecretkey_mlm_2026';
    this.expiry = '30d';
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, this.secret, {
      expiresIn: this.expiry
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired authentication token');
    }
  }
}

module.exports = new TokenService();
