const AuthService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('[AuthController.register] Error:', error.message);
      return res.status(error.message.includes('registered') ? 400 : 500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req, res) {
    try {
      const { loginId, password } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
      const userAgent = req.headers['user-agent'] || '';

      const result = await AuthService.login(loginId, password, ipAddress, userAgent);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('[AuthController.login] Error:', error.message);
      return res.status(error.message.includes('credentials') || error.message.includes('suspended') ? 401 : 500).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async verifySponsor(req, res) {
    try {
      const result = await AuthService.verifySponsor(req.params.sponsorId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Sponsor check failed'
      });
    }
  }

  async verifyParent(req, res) {
    try {
      const { parentId, position } = req.query;
      if (!parentId || !position) {
        return res.status(400).json({
          success: false,
          message: 'Both parentId and position query parameters are required'
        });
      }
      const result = await AuthService.verifyParent(parentId, position);
      return res.status(200).json({
        success: true,
        message: 'Placement position is vacant',
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Parent check failed'
      });
    }
  }
}

module.exports = new AuthController();
