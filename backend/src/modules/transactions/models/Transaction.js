const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be at least 0.01']
    },
    type: {
      type: String,
      enum: {
        values: ['credit', 'debit'],
        message: '{VALUE} is not a valid transaction type'
      },
      required: [true, 'Transaction type (credit/debit) is required']
    },
    wallet: {
      type: String,
      enum: {
        values: ['main', 'income', 'recharge', 'reward'],
        message: '{VALUE} is not a valid target wallet'
      },
      required: [true, 'Target wallet type is required']
    },
    incomeType: {
      type: String,
      enum: {
        values: ['ROI Income', 'Direct Income', 'Level Income', 'Binary Income', 'reward', 'refund', 'transfer', null],
        message: '{VALUE} is not a valid income type'
      },
      default: null
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
