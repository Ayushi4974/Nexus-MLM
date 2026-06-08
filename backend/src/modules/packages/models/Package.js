const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      unique: true,
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Package price is required'],
      min: [0, 'Package price cannot be negative']
    },
    roi: {
      type: Number,
      required: [true, 'Daily ROI yield percentage is required'],
      min: [0, 'Daily ROI percentage cannot be negative']
    },
    bv: {
      type: Number,
      required: [true, 'Business Volume (BV) is required'],
      min: [0, 'Business Volume (BV) cannot be negative']
    },
    validity: {
      type: Number,
      required: [true, 'Validity (in days) is required'],
      min: [1, 'Validity must be at least 1 day']
    },
    maxIncome: {
      type: Number,
      required: [true, 'Maximum income ceiling (capping limit) is required'],
      min: [0, 'Maximum income ceiling cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Package || mongoose.model('Package', PackageSchema);
