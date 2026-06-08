const walletService = require('../services/walletService');

class WalletController {
  // GET /api/wallet - retrieve wallet balances
  async getBalances(req, res) {
    try {
      const wallets = await walletService.getWallet(req.user._id);
      return res.status(200).json({ success: true, data: wallets });
    } catch (error) {
      console.error('Get wallets error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/wallet/transfer - transfer between user wallets
  async transfer(req, res) {
    try {
      const { from, to, amount } = req.body;
      const result = await walletService.transferFunds(req.user._id, { from, to, amount });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Transfer error:', error);
      const status = error.status || 400;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  // POST /api/wallet/withdraw - create withdrawal request
  async withdraw(req, res) {
    try {
      const { amount, bankDetails } = req.body;
      const result = await walletService.requestWithdrawal(req.user._id, { amount, bankDetails });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Withdrawal request error:', error);
      const status = error.status || 400;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  // Admin processing of withdrawal (approve/reject)
  async processWithdrawal(req, res) {
    try {
      const adminId = req.user._id; // admin user
      const { id } = req.params;
      const { approve, remarks } = req.body; // approve: true/false
      // Delegates to a service method (to be implemented later) – for now respond placeholder
      return res.status(200).json({ success: true, message: 'Withdrawal processing not yet implemented' });
    } catch (error) {
      console.error('Process withdrawal error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new WalletController();
