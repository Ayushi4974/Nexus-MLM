const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sponsorId: {
      type: String,
      default: '',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    parentId: {
      type: String,
      default: '',
    },
    position: {
      type: String,
      enum: ['left', 'right', 'root'],
      default: 'left',
    },
    leftCount: {
      type: Number,
      default: 0,
    },
    rightCount: {
      type: Number,
      default: 0,
    },
    leftBV: {
      type: Number,
      default: 0,
    },
    rightBV: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    activePackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null,
    },
    rank: {
      type: String,
      enum: ['Member', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
      default: 'Member',
    },
    wallets: {
      main: { type: Number, default: 0 },
      income: { type: Number, default: 0 },
      recharge: { type: Number, default: 0 },
      reward: { type: Number, default: 0 },
    },
    bankDetails: {
      accountNumber: { type: String, default: '' },
      ifsc: { type: String, default: '' },
      bankName: { type: String, default: '' },
      holderName: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    totalROIPaid: {
      type: Number,
      default: 0,
    },
    packageActivatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
