const { User, Transaction, Notification } = require('../models');

// @desc    Get wallet balances
// @route   GET /api/wallet/balances
// @access  Private
const getWalletBalances = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        data: user.wallets,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, incomeType, search } = req.query;

    const query = { user: req.user._id };

    if (type) {
      query.type = type;
    }

    if (incomeType) {
      query.incomeType = incomeType;
    }

    // If search is provided, we can search by description
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const transactions = await Transaction.find(query)
      .populate('fromUser', 'username name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Transfer funds to another user's Recharge wallet
// @route   POST /api/wallet/transfer
// @access  Private
const transferFunds = async (req, res) => {
  try {
    const { recipientId, amount, remarks } = req.body;

    if (!recipientId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid recipient ID or amount' });
    }

    // Find recipient
    const recipient = await User.findOne({ username: recipientId });
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // Check if transferring to self
    if (recipient._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot transfer funds to yourself' });
    }

    const sender = await User.findById(req.user._id);

    // Verify sender has sufficient funds in Main Wallet
    if (sender.wallets.main < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance in Main Wallet' });
    }

    // Perform Transfer
    sender.wallets.main -= Number(amount);
    recipient.wallets.recharge += Number(amount);

    await sender.save();
    await recipient.save();

    // Create debit transaction for sender
    const debitTx = await Transaction.create({
      user: sender._id,
      type: 'debit',
      amount: Number(amount),
      incomeType: 'Fund Transfer',
      description: `Transferred to ${recipient.name} (${recipient.username}). Remarks: ${remarks || 'None'}`,
      status: 'success',
    });

    // Create credit transaction for recipient
    const creditTx = await Transaction.create({
      user: recipient._id,
      type: 'credit',
      amount: Number(amount),
      incomeType: 'Fund Transfer',
      fromUser: sender._id,
      description: `Received from ${sender.name} (${sender.username}). Remarks: ${remarks || 'None'}`,
      status: 'success',
    });

    // Notify recipient
    await Notification.create({
      user: recipient._id,
      title: 'Funds Received',
      message: `You received $${amount} from ${sender.name} (${sender.username}) in your Recharge Wallet.`,
      type: 'income',
    });

    // Notify sender
    await Notification.create({
      user: sender._id,
      title: 'Funds Transferred',
      message: `You successfully transferred $${amount} to ${recipient.name} (${recipient.username}).`,
      type: 'general',
    });

    res.json({
      success: true,
      message: `Successfully transferred $${amount} to ${recipient.name}`,
      data: {
        newBalance: sender.wallets.main,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWalletBalances,
  getTransactions,
  transferFunds,
};
