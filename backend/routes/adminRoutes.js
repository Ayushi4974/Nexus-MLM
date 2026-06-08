const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  creditUserWallet,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  createPackage,
  updatePackage,
  deletePackage,
  getAllTransactions,
  broadcastNotification,
  runDailyROICron,
} = require('../controllers/adminController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');

// Dashboard stats
router.get('/stats', protect, protectAdmin, getDashboardStats);

// User management
router.get('/users', protect, protectAdmin, getAllUsers);
router.get('/users/:id', protect, protectAdmin, getUserById);
router.put('/users/:id/status', protect, protectAdmin, toggleUserStatus);
router.post('/users/:id/credit-wallet', protect, protectAdmin, creditUserWallet);

// Withdrawal management
router.get('/withdrawals', protect, protectAdmin, getAllWithdrawals);
router.put('/withdrawals/:id/approve', protect, protectAdmin, approveWithdrawal);
router.put('/withdrawals/:id/reject', protect, protectAdmin, rejectWithdrawal);

// Package CRUD
router.post('/packages', protect, protectAdmin, createPackage);
router.put('/packages/:id', protect, protectAdmin, updatePackage);
router.delete('/packages/:id', protect, protectAdmin, deletePackage);

// Transaction history audit
router.get('/transactions', protect, protectAdmin, getAllTransactions);

// Notifications broadcast
router.post('/notifications/broadcast', protect, protectAdmin, broadcastNotification);

// Manual ROI payout execution trigger
router.post('/cron/run-roi', protect, protectAdmin, runDailyROICron);

module.exports = router;
