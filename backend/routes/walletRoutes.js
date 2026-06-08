const express = require('express');
const router = express.Router();
const {
  getWalletBalances,
  getTransactions,
  transferFunds,
} = require('../controllers/walletController');
const {
  requestWithdrawal,
  getWithdrawalHistory,
} = require('../controllers/withdrawalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/balances', getWalletBalances);
router.get('/transactions', getTransactions);
router.post('/transfer', transferFunds);
router.post('/withdraw', requestWithdrawal);
router.get('/withdrawals', getWithdrawalHistory);

module.exports = router;

