const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'REGISTRATION_SUCCESS',
        'PACKAGE_PURCHASED',
        'PACKAGE_EXPIRED',
        'DIRECT_INCOME_CREDITED',
        'LEVEL_INCOME_CREDITED',
        'BINARY_INCOME_CREDITED',
        'ROI_INCOME_CREDITED',
        'REWARD_ACHIEVED',
        'RANK_UPGRADED',
        'WALLET_TRANSFER_SENT',
        'WALLET_TRANSFER_RECEIVED',
        'WITHDRAWAL_REQUESTED',
        'WITHDRAWAL_APPROVED',
        'WITHDRAWAL_REJECTED',
        'PROFILE_UPDATED',
        'PASSWORD_CHANGED',
        'ADMIN_WALLET_CREDIT',
        'ADMIN_WALLET_DEBIT',
        'USER_BLOCKED',
        'USER_UNBLOCKED',
        'SYSTEM_BROADCAST',
        'general'
      ],
      default: 'general',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
