const mongoose = require('mongoose');

const RoiLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  date: { type: Date, required: true, default: Date.now },
  roiPercent: { type: Number, required: true }, // e.g., 1 for 1%
  amount: { type: Number, required: true }, // credited amount
});

module.exports = mongoose.model('RoiLog', RoiLogSchema);
