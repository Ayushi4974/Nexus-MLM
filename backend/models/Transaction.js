const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    incomeType: {
      type: String,
      enum: [
        'Direct Referral',
        'Binary Matching',
        'Level Income',
        'ROI Daily',
        'Reward',
        'Fund Transfer',
        'Package Buy',
        'Withdrawal',
        'Other'
      ],
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
