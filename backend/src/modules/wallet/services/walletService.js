const mongoose = require('mongoose');
const WalletRepository = require('../repositories/walletRepository');
const TransactionRepository = require('../../../repositories/TransactionRepository');
const AuditLogRepository = require('../../../repositories/AuditLogRepository');
const NotificationRepository = require('../../../repositories/NotificationRepository');

class WalletService {
  // Get wallet balances for a user
  async getWallet(userId) {
    const user = await WalletRepository.getByUserId(userId);
    if (!user) throw new Error('User not found');
    return user.wallets;
  }

  // Internal helper to log a wallet transaction
  async _logTransaction(userId, amount, type, wallet, description, session) {
    await TransactionRepository.create({
      user: userId,
      amount,
      type,
      wallet,
      description,
      createdAt: new Date()
    }, session);
    await AuditLogRepository.log(userId, 'WALLET_' + type.toUpperCase(), { amount, wallet, description }, '', '', session);
  }

  // Credit wallet (adds funds)
  async creditWallet(userId, { wallet, amount }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await WalletRepository.getByUserId(userId);
      if (!user) throw new Error('User not found');
      const newBalance = parseFloat((user.wallets[wallet] + amount).toFixed(2));
      await WalletRepository.updateWallets(userId, { [wallet]: newBalance }, session);
      await this._logTransaction(userId, amount, 'credit', wallet, 'Wallet credit', session);
      await session.commitTransaction();
      session.endSession();
      return { wallet, balance: newBalance };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // Debit wallet (subtract funds) – ensures sufficient balance
  async debitWallet(userId, { wallet, amount }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await WalletRepository.getByUserId(userId);
      if (!user) throw new Error('User not found');
      if (user.wallets[wallet] < amount) {
        throw new Error('Insufficient funds in ' + wallet + ' wallet');
      }
      const newBalance = parseFloat((user.wallets[wallet] - amount).toFixed(2));
      await WalletRepository.updateWallets(userId, { [wallet]: newBalance }, session);
      await this._logTransaction(userId, amount, 'debit', wallet, 'Wallet debit', session);
      await session.commitTransaction();
      session.endSession();
      return { wallet, balance: newBalance };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // Transfer between user's own wallets
  async transferFunds(userId, { from, to, amount }) {
    if (from === to) throw new Error('Source and target wallets must differ');
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await WalletRepository.getByUserId(userId);
      if (!user) throw new Error('User not found');
      if (user.wallets[from] < amount) {
        throw new Error('Insufficient funds in source wallet');
      }
      const newFrom = parseFloat((user.wallets[from] - amount).toFixed(2));
      const newTo = parseFloat((user.wallets[to] + amount).toFixed(2));
      await WalletRepository.updateWallets(userId, { [from]: newFrom, [to]: newTo }, session);
      await this._logTransaction(userId, amount, 'transfer', from, `Transfer to ${to}`, session);
      await session.commitTransaction();
      session.endSession();
      return { from: { wallet: from, balance: newFrom }, to: { wallet: to, balance: newTo } };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // Create a withdrawal request – funds are deducted from recharge wallet first then main
  async requestWithdrawal(userId, { amount, bankDetails }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await WalletRepository.getByUserId(userId);
      if (!user) throw new Error('User not found');
      const totalAvailable = user.wallets.recharge + user.wallets.main;
      if (totalAvailable < amount) {
        throw new Error('Insufficient wallet balance for withdrawal');
      }
      // Deduct similar to purchase logic
      let remaining = amount;
      if (user.wallets.recharge >= remaining) {
        user.wallets.recharge = parseFloat((user.wallets.recharge - remaining).toFixed(2));
        remaining = 0;
      } else {
        remaining -= user.wallets.recharge;
        user.wallets.recharge = 0;
        user.wallets.main = parseFloat((user.wallets.main - remaining).toFixed(2));
        remaining = 0;
      }
      await WalletRepository.updateWallets(userId, { wallets: user.wallets }, session);
      // Log withdrawal transaction (type debit, wallet 'main')
      await this._logTransaction(userId, amount, 'debit', 'main', 'Withdrawal request', session);
      // Create withdrawal document (assumes WithdrawalRepository exists)
      const WithdrawalRepository = require('../../../repositories/WithdrawalRepository');
      await WithdrawalRepository.create({
        user: userId,
        amount,
        charges: 0, // placeholder – could be calculated later
        payableAmount: amount,
        bankDetails,
        status: 'pending'
      }, session);
      // Notify user
      await NotificationRepository.create({
        user: userId,
        title: 'Withdrawal Requested',
        message: `Your withdrawal request of ₹${amount} is pending approval.`
      }, session);
      await session.commitTransaction();
      session.endSession();
      return { message: 'Withdrawal request created', wallets: user.wallets };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}

module.exports = new WalletService();
