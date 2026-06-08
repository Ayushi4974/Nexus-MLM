const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifySponsor,
  verifyParent,
} = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const { refreshToken } = require('../src/controllers/tokenController');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);

// OTP routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Verification helpers
router.get('/verify-sponsor/:sponsorId', verifySponsor);
router.get('/verify-parent', verifyParent);

module.exports = router;
