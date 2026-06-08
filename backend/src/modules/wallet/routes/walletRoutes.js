const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');
const walletValidation = require('../validations/walletValidation');
const { protect, protectAdmin } = require('../../../middleware/authMiddleware');

// User routes
router.get('/', protect, walletController.getBalances);
router.post('/transfer', protect, walletValidation.validateTransfer, walletController.transfer);
router.post('/withdraw', protect, walletValidation.validateWithdraw, walletController.withdraw);
// Admin route for processing withdrawals
router.put('/withdrawals/:id', protectAdmin, walletController.processWithdrawal);

module.exports = router;
