const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    charges: {
      type: Number, // fee percentage or flat fee, e.g. 10%
      required: true,
    },
    payableAmount: {
      type: Number,
      required: true,
    },
    bankDetails: {
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
      bankName: { type: String, required: true },
      holderName: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Withdrawal || mongoose.model('Withdrawal', WithdrawalSchema);
