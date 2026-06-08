const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    action: {
      type: String,
      required: [true, 'Audit action type is required'],
      trim: true,
      index: true
    },
    details: {
      type: mongoose.Schema.Types.Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // Only track creation time
  }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
