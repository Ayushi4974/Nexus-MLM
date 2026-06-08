const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Withdrawal amount is required'],
      min: [500, 'Minimum withdrawal amount is ₹500'],
      max: [100000, 'Maximum withdrawal amount is ₹100,000']
    },
    charges: {
      processingFee: {
        type: Number,
        required: true,
        min: [0, 'Processing fee cannot be negative']
      },
      tds: {
        type: Number,
        required: true,
        min: [0, 'TDS deduction cannot be negative']
      },
      totalDeduction: {
        type: Number,
        required: true,
        min: [0, 'Total deduction cannot be negative']
      }
    },
    netAmount: {
      type: Number,
      required: [true, 'Net payout amount is required'],
      min: [0, 'Net amount cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} is not a valid withdrawal status'
      },
      default: 'pending',
      index: true
    },
    remarks: {
      type: String,
      default: '',
      trim: true
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Only enforces uniqueness for non-null values
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Withdrawal || mongoose.model('Withdrawal', WithdrawalSchema);
