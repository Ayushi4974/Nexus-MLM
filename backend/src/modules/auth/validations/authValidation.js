class AuthValidation {
  validateRegister(req, res, next) {
    const { name, email, mobile, password, sponsorId } = req.body;

    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('Full name is required and must be a string');
    }

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push('A valid email address is required');
    }

    if (!mobile || !/^\+?[0-9]{10,15}$/.test(mobile)) {
      errors.push('A valid mobile number is required (10-15 digits)');
    }

    // Password strength check: Min 8 chars, at least one uppercase, and at least one number
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Sanitize and format
    req.body.email = email.toLowerCase().trim();
    req.body.name = name.trim();
    req.body.mobile = mobile.trim();
    if (sponsorId) {
      req.body.sponsorId = sponsorId.toUpperCase().trim();
    }

    next();
  }

  validateLogin(req, res, next) {
    const { loginId, password } = req.body;

    const errors = [];

    if (!loginId || typeof loginId !== 'string' || loginId.trim() === '') {
      errors.push('Login ID (email, mobile, or username) is required');
    }

    if (!password || typeof password !== 'string' || password === '') {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body.loginId = loginId.trim();

    next();
  }
}

module.exports = new AuthValidation();
