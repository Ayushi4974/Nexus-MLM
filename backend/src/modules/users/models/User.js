const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          // Allow 'ADMIN', 'MLM' + 6 digits (root 'MLM000001' and general signups)
          return v === 'ADMIN' || /^MLM[0-9]{6}$/.test(v);
        },
        message: props => `${props.value} is not a valid username format! Format must be MLMXXXXXX or ADMIN.`
      },
      index: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      },
      index: true
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9]{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! Must be 10-15 digits.`
      },
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    sponsorId: {
      type: String,
      default: '',
      trim: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    parentId: {
      type: String,
      default: '',
      trim: true,
      index: true
    },
    position: {
      type: String,
      enum: {
        values: ['left', 'right', 'root'],
        message: '{VALUE} is not a valid placement position'
      },
      default: 'left'
    },
    leftCount: {
      type: Number,
      default: 0,
      min: [0, 'Subtree count cannot be negative']
    },
    rightCount: {
      type: Number,
      default: 0,
      min: [0, 'Subtree count cannot be negative']
    },
    leftBV: {
      type: Number,
      default: 0,
      min: [0, 'Business volume cannot be negative']
    },
    rightBV: {
      type: Number,
      default: 0,
      min: [0, 'Business volume cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'blocked'],
        message: '{VALUE} is not a valid user status'
      },
      default: 'inactive',
      index: true
    },
    activePackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null,
      index: true
    },
    packageActivatedAt: {
      type: Date,
      default: null
    },
    totalROIPaid: {
      type: Number,
      default: 0,
      min: [0, 'ROI payout cannot be negative']
    },
    wallets: {
      main: {
        type: Number,
        default: 0,
        min: [0, 'Wallet balance cannot be negative']
      },
      income: {
        type: Number,
        default: 0,
        min: [0, 'Wallet balance cannot be negative']
      },
      recharge: {
        type: Number,
        default: 0,
        min: [0, 'Wallet balance cannot be negative']
      },
      reward: {
        type: Number,
        default: 0,
        min: [0, 'Wallet balance cannot be negative']
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: {
        values: ['Member', 'Silver', 'Gold', 'Diamond', 'Crown'],
        message: '{VALUE} is not a valid rank'
      },
      default: 'Member'
    }
  },
  {
    timestamps: true
  }
);

// Hash password hook
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password check
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
