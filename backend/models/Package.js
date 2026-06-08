const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    roi: {
      type: Number, // percentage return per day, e.g. 1%
      required: true,
    },
    bv: {
      type: Number, // Business Volume for binary points
      required: true,
    },
    validity: {
      type: Number, // Validity in days, e.g. 365
      required: true,
    },
    maxIncome: {
      type: Number, // Capping / Max daily income ceiling
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Package || mongoose.model('Package', PackageSchema);
