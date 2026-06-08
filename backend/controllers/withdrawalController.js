const { User, Withdrawal, Transaction, Notification } = require('../models');

// @desc    Submit withdrawal request
// @route   POST /api/wallet/withdraw
// @access  Private
const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    const minWithdrawal = 10; // Minimum limit
    if (amount < minWithdrawal) {
      return res.status(400).json({ success: false, message: `Minimum withdrawal amount is $${minWithdrawal}` });
    }

    const user = await User.findById(req.user._id);

    // Verify bank details are set
    const bank = user.bankDetails;
    if (!bank.accountNumber || !bank.ifsc || !bank.bankName || !bank.holderName) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your bank details in Profile settings before requesting a withdrawal',
      });
    }

    // Verify user has sufficient income wallet balance
    if (user.wallets.income < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient income wallet balance' });
    }

    // Calculations
    const feePercent = 0.1; // 10% withdrawal charges
    const charges = Number((amount * feePercent).toFixed(2));
    const payableAmount = Number((amount - charges).toFixed(2));

    // Deduct from income wallet
    user.wallets.income -= Number(amount);
    await user.save();

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      user: user._id,
      amount: Number(amount),
      charges,
      payableAmount,
      bankDetails: {
        accountNumber: bank.accountNumber,
        ifsc: bank.ifsc,
        bankName: bank.bankName,
        holderName: bank.holderName,
      },
      status: 'pending',
    });

    // Create debit transaction log (marked as pending)
    await Transaction.create({
      user: user._id,
      type: 'debit',
      amount: Number(amount),
      incomeType: 'Withdrawal',
      description: `Withdrawal request submitted ($${amount} - $${charges} charges). Pending admin approval.`,
      status: 'pending',
    });

    // Create notification
    await Notification.create({
      user: user._id,
      title: 'Withdrawal Requested',
      message: `Your withdrawal request of $${amount} has been submitted and is pending review.`,
      type: 'withdrawal',
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get withdrawal requests history
// @route   GET /api/wallet/withdrawals
// @access  Private
const getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: withdrawals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  requestWithdrawal,
  getWithdrawalHistory,
};
