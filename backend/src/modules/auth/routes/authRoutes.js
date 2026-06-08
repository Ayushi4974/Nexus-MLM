const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const AuthValidation = require('../validations/authValidation');

// Registration API
router.post('/register', AuthValidation.validateRegister, AuthController.register);

// Login API
router.post('/login', AuthValidation.validateLogin, AuthController.login);

// Sponsor check API
router.get('/verify-sponsor/:sponsorId', AuthController.verifySponsor);

// Placement position check API
router.get('/verify-parent', AuthController.verifyParent);

module.exports = router;
