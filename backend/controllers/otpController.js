const { OTP } = require('../models');
const { sendOTPEmail } = require('../config/mailer');
const crypto = require('crypto');

// Generate a secure 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// ─────────────────────────────────────────────
// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
// ─────────────────────────────────────────────
const sendOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Rate limiting: Check if OTP was sent in last 60 seconds
    const recentOTP = await OTP.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentOTP) {
      const waitSeconds = Math.ceil(
        (recentOTP.createdAt.getTime() + 60000 - Date.now()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting a new OTP`,
      });
    }

    // Delete any previous OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Generate OTP
    const otpCode = generateOTP();

    // Store in DB
    const otpDoc = await OTP.create({
      email: email.toLowerCase(),
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // Send email via SMTP
    await sendOTPEmail(email, otpCode, name || 'Member');

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`,
      expiresIn: 600, // seconds
    });
  } catch (error) {
    console.error('Send OTP Error:', error);

    // SMTP config error
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      return res.status(500).json({
        success: false,
        message: 'Email service configuration error. Please check SMTP credentials in .env',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
    });
  }
};

// ─────────────────────────────────────────────
// @desc    Verify OTP entered by user
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    // Find the most recent OTP for this email
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or was not found. Please request a new one.',
      });
    }

    // Max attempts check (3 tries)
    if (otpDoc.attempts >= 3) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({
        success: false,
        message: 'Too many wrong attempts. Please request a new OTP.',
      });
    }

    // Check OTP match
    if (otpDoc.otp !== otp.trim()) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      const remaining = 3 - otpDoc.attempts;
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${remaining} attempt(s) remaining.`,
      });
    }

    // Mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ success: false, message: 'Verification failed. Try again.' });
  }
};

module.exports = { sendOTP, verifyOTP };
