const { User, Package, Transaction, Withdrawal, Notification } = require('../models');

// Helper to wrap promises for Mongoose query method chaining compatibility in mock DB mode
const makeChainable = (promise) => {
  promise.populate = function() { return makeChainable(this); };
  promise.sort = function() { return makeChainable(this); };
  promise.select = function() { return makeChainable(this); };
  promise.limit = function() { return makeChainable(this); };
  promise.skip = function() { return makeChainable(this); };
  promise.lean = function() { return makeChainable(this); };
  promise.exec = function() { return this; };
  return promise;
};

const wrapAsync = (fn) => {
  return (...args) => makeChainable(fn(...args));
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const users = await User.find({});
    const withdrawals = await Withdrawal.find({});
    const packages = await Package.find({});

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = totalUsers - activeUsers;

    // Calculate total investment/sales (sum of price of packages bought by active users)
    let totalRevenue = 0;
    users.forEach(u => {
      if (u.activePackage) {
        // If package is loaded as relation
        const pkgId = u.activePackage._id || u.activePackage;
        const pkg = packages.find(p => p._id.toString() === pkgId.toString());
        if (pkg) {
          totalRevenue += pkg.price;
        }
      }
    });

    // Sum up all distributed income from transactions
    const txs = await Transaction.find({});
    let totalIncomeDistributed = 0;
    txs.forEach(t => {
      if (t.type === 'income' || t.incomeType) {
        totalIncomeDistributed += t.amount;
      }
    });

    const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalRevenue,
        totalIncomeDistributed,
        pendingWithdrawalsCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let users = await User.find({});

    if (search) {
      const term = search.toLowerCase();
      users = users.filter(u => 
        u.username.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.mobile.includes(term)
      );
    }

    if (status) {
      users = users.filter(u => u.status === status);
    }

    // Map responses to exclude password
    const responseData = users.map(u => {
      const uObj = u.toObject ? u.toObject() : { ...u };
      delete uObj.password;
      return uObj;
    });

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get User By ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    // Load user transactions
    const transactions = await Transaction.find({ user: req.params.id });

    // Load user withdrawals
    const withdrawals = await Withdrawal.find({ user: req.params.id });

    res.json({
      success: true,
      data: {
        user: userObj,
        transactions,
        withdrawals
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle User Status (Activate/Deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${user.status}`,
      data: { _id: user._id, status: user.status }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Credit/Adjust User Wallet manually
// @route   POST /api/admin/users/:id/credit-wallet
// @access  Private/Admin
const creditUserWallet = async (req, res) => {
  try {
    const { walletType, amount, description } = req.body;
    if (!walletType || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide valid wallet type and amount (> 0)' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.wallets[walletType] && user.wallets[walletType] !== 0) {
      return res.status(400).json({ success: false, message: 'Invalid wallet type' });
    }

    // Add amount
    user.wallets[walletType] = parseFloat((user.wallets[walletType] + parseFloat(amount)).toFixed(2));
    await user.save();

    // Log transaction
    await Transaction.create({
      user: user._id,
      amount: parseFloat(amount),
      type: 'credit',
      incomeType: walletType === 'income' ? 'Reward' : 'Other',
      description: description || `Admin Manual Credit to ${walletType} wallet`
    });

    // Notify user
    await Notification.create({
      user: user._id,
      title: 'Wallet Credited',
      message: `Your ${walletType} wallet was credited with $${amount} by Administrator.`
    });

    res.json({
      success: true,
      message: `Successfully credited $${amount} to user's ${walletType} wallet.`,
      data: user.wallets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Withdrawals
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
const getAllWithdrawals = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }

    const withdrawals = await Withdrawal.find(query);
    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Pending Withdrawal
// @route   PUT /api/admin/withdrawals/:id/approve
// @access  Private/Admin
const approveWithdrawal = async (req, res) => {
  try {
    const wth = await Withdrawal.findById(req.params.id);
    if (!wth) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
    }

    if (wth.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${wth.status}` });
    }

    wth.status = 'approved';
    wth.remarks = req.body.remarks || 'Approved by Admin';
    await wth.save();

    const userId = wth.user._id || wth.user;

    // Log global transaction as debit
    await Transaction.create({
      user: userId,
      amount: wth.amount,
      type: 'debit',
      incomeType: 'Withdrawal',
      description: `Withdrawal Approved (Amount: $${wth.amount}, Fee: $${wth.charges})`
    });

    // Notify User
    await Notification.create({
      user: userId,
      title: 'Withdrawal Approved',
      message: `Your withdrawal request of $${wth.amount} has been approved and disbursed.`
    });

    res.json({
      success: true,
      message: 'Withdrawal approved successfully',
      data: wth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Pending Withdrawal
// @route   PUT /api/admin/withdrawals/:id/reject
// @access  Private/Admin
const rejectWithdrawal = async (req, res) => {
  try {
    const wth = await Withdrawal.findById(req.params.id);
    if (!wth) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
    }

    if (wth.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${wth.status}` });
    }

    wth.status = 'rejected';
    wth.remarks = req.body.remarks || 'Rejected by Admin';
    await wth.save();

    // Refund funds to user income wallet
    const userId = wth.user._id || wth.user;
    const user = await User.findById(userId);
    if (user) {
      user.wallets.income = parseFloat((user.wallets.income + wth.amount).toFixed(2));
      await user.save();

      // Log transaction
      await Transaction.create({
        user: userId,
        amount: wth.amount,
        type: 'credit',
        incomeType: 'Other',
        description: `Withdrawal Rejected Refund (Amount: $${wth.amount})`
      });

      // Notify User
      await Notification.create({
        user: userId,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request of $${wth.amount} has been rejected. Funds refunded to income wallet. Reason: ${wth.remarks}`
      });
    }

    res.json({
      success: true,
      message: 'Withdrawal request rejected and funds refunded',
      data: wth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Package
// @route   POST /api/admin/packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const { name, price, roi, bv, validity, maxIncome } = req.body;
    if (!name || !price || !roi || !bv || !validity || !maxIncome) {
      return res.status(400).json({ success: false, message: 'Please provide all package details' });
    }

    const pkg = await Package.create({
      name,
      price: parseFloat(price),
      roi: parseFloat(roi),
      bv: parseInt(bv),
      validity: parseInt(validity),
      maxIncome: parseFloat(maxIncome)
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: pkg
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Package
// @route   PUT /api/admin/packages/:id
// @access  Private/Admin
const updatePackage = async (req, res) => {
  try {
    const { name, price, roi, bv, validity, maxIncome } = req.body;
    
    // For Mongoose findByIdAndUpdate, for mockDb findByIdAndUpdate
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { name, price, roi, bv, validity, maxIncome },
      { new: true }
    );

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      data: pkg
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Package
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All System Transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
  try {
    const { type, incomeType, search } = req.query;
    let txs = await Transaction.find({});

    if (type) {
      txs = txs.filter(t => t.type === type);
    }
    if (incomeType) {
      txs = txs.filter(t => t.incomeType === incomeType);
    }
    if (search) {
      const term = search.toLowerCase();
      txs = txs.filter(t => {
        const userMatch = t.user && (t.user.username || '').toLowerCase().includes(term);
        const fromUserMatch = t.fromUser && (t.fromUser.username || '').toLowerCase().includes(term);
        const descMatch = t.description && t.description.toLowerCase().includes(term);
        return userMatch || fromUserMatch || descMatch;
      });
    }

    res.json({
      success: true,
      data: txs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Broadcast Notification to all users
// @route   POST /api/admin/notifications/broadcast
// @access  Private/Admin
const broadcastNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide title and message' });
    }

    const users = await User.find({});
    
    // Broadcast notification to all active/inactive users
    const promises = users.map(u => 
      Notification.create({
        user: u._id,
        title,
        message
      })
    );
    await Promise.all(promises);

    res.json({
      success: true,
      message: `Notification broadcasted to ${users.length} users successfully.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Run Daily ROI Cron payout manually
// @route   POST /api/admin/cron/run-roi
// @access  Private/Admin
const runDailyROICron = async (req, res) => {
  try {
    const users = await User.find({ status: 'active' });
    const packages = await Package.find({});

    let processedCount = 0;
    let totalYieldDistributed = 0;

    for (let user of users) {
      if (!user.activePackage) continue;

      // Find user package
      const pkgId = user.activePackage._id || user.activePackage;
      const pkg = packages.find(p => p._id.toString() === pkgId.toString());
      if (!pkg) continue;

      // Check validity
      if (user.packageActivatedAt) {
        const activeDate = new Date(user.packageActivatedAt);
        const daysDiff = Math.floor((new Date() - activeDate) / (1000 * 60 * 60 * 24));
        if (daysDiff >= pkg.validity) {
          // Expire package
          user.activePackage = null;
          user.status = 'inactive';
          await user.save();

          await Notification.create({
            user: user._id,
            title: 'Package Expired',
            message: `Your package ${pkg.name} has expired after reaching its validity of ${pkg.validity} days.`
          });
          continue;
        }
      }

      // Check lifetime capping (totalROIPaid >= maxIncome)
      const currentPaid = user.totalROIPaid || 0;
      if (currentPaid >= pkg.maxIncome) {
        // Expire package
        user.activePackage = null;
        user.status = 'inactive';
        await user.save();

        await Notification.create({
          user: user._id,
          title: 'Package Capping Reached',
          message: `Your package ${pkg.name} has been expired because it reached its maximum income ceiling of $${pkg.maxIncome}.`
        });
        continue;
      }

      // Calculate yield
      const dailyRoiPercent = pkg.roi; // e.g. 1%
      let dailyYield = Number((pkg.price * (dailyRoiPercent / 100)).toFixed(2));

      // Assert cap limit adjustments
      if (currentPaid + dailyYield > pkg.maxIncome) {
        dailyYield = Number((pkg.maxIncome - currentPaid).toFixed(2));
      }

      if (dailyYield > 0) {
        user.totalROIPaid = Number((currentPaid + dailyYield).toFixed(2));
        user.wallets.income = Number((user.wallets.income + dailyYield).toFixed(2));
        user.wallets.main = Number((user.wallets.main + dailyYield).toFixed(2));
        await user.save();

        // Create transaction logs
        await Transaction.create({
          user: user._id,
          amount: dailyYield,
          type: 'credit',
          incomeType: 'ROI Daily',
          description: `Daily ROI Income payout from ${pkg.name}`
        });

        // Notify user
        await Notification.create({
          user: user._id,
          title: 'Daily ROI Credited',
          message: `You earned $${dailyYield} Daily ROI (yield: ${pkg.roi}%) from active ${pkg.name}.`
        });

        processedCount++;
        totalYieldDistributed += dailyYield;
      }
    }

    res.json({
      success: true,
      message: `Successfully processed ROI payouts. Credited ${processedCount} active user accounts with a total of $${totalYieldDistributed.toFixed(2)} ROI yield.`,
      data: {
        processedCount,
        totalYieldDistributed
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  creditUserWallet,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  createPackage,
  updatePackage,
  deletePackage,
  getAllTransactions,
  broadcastNotification,
  runDailyROICron
};
