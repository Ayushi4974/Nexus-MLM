const { Package, User, Transaction, Notification } = require('../models');

// Auto seed default packages if database is empty
const seedPackages = async () => {
  const count = await Package.countDocuments();
  if (count === 0) {
    await Package.create([
      { name: 'Starter Package', price: 100, roi: 1.0, bv: 100, validity: 360, maxIncome: 200 },
      { name: 'Premium Package', price: 500, roi: 1.2, bv: 500, validity: 360, maxIncome: 1000 },
      { name: 'Elite Package', price: 1000, roi: 1.5, bv: 1000, validity: 360, maxIncome: 2500 },
      { name: 'VIP Package', price: 5000, roi: 2.0, bv: 5000, validity: 360, maxIncome: 15000 },
    ]);
    console.log('Default MLM Packages seeded successfully.');
  }
};

// Helper: Distribute direct referral income (10% to sponsor)
const distributeDirectIncome = async (buyer, packagePrice) => {
  if (!buyer.sponsor) return;

  const sponsor = await User.findById(buyer.sponsor);
  if (!sponsor) return;

  const directCommission = Number((packagePrice * 0.1).toFixed(2));
  sponsor.wallets.income += directCommission;
  sponsor.wallets.main += directCommission; // Add directly to main or income
  await sponsor.save();

  await Transaction.create({
    user: sponsor._id,
    type: 'credit',
    amount: directCommission,
    incomeType: 'Direct Referral',
    fromUser: buyer._id,
    description: `Direct Referral Income from purchase of ${buyer.username}`,
    status: 'success',
  });

  await Notification.create({
    user: sponsor._id,
    title: 'Referral Commission Credited',
    message: `You earned $${directCommission} direct referral commission from ${buyer.name} (${buyer.username}).`,
    type: 'income',
  });
};

// Helper: Distribute level income (5 levels: 5%, 3%, 2%, 1%, 1%)
const distributeLevelIncome = async (buyer, packagePrice) => {
  const levelPercentages = [0.05, 0.03, 0.02, 0.01, 0.01];
  let currentSponsorId = buyer.sponsor;

  for (let i = 0; i < levelPercentages.length; i++) {
    if (!currentSponsorId) break;

    const sponsor = await User.findById(currentSponsorId);
    if (!sponsor) break;

    const levelCommission = Number((packagePrice * levelPercentages[i]).toFixed(2));
    sponsor.wallets.income += levelCommission;
    sponsor.wallets.main += levelCommission;
    await sponsor.save();

    await Transaction.create({
      user: sponsor._id,
      type: 'credit',
      amount: levelCommission,
      incomeType: 'Level Income',
      fromUser: buyer._id,
      description: `Level ${i + 1} Income from purchase of ${buyer.username}`,
      status: 'success',
    });

    await Notification.create({
      user: sponsor._id,
      title: `Level ${i + 1} Income Credited`,
      message: `You earned $${levelCommission} Level ${i + 1} Income from ${buyer.name} (${buyer.username}).`,
      type: 'income',
    });

    // Move to next sponsor level
    currentSponsorId = sponsor.sponsor;
  }
};

// Helper: Distribute BV and run binary matching immediately
const distributeBVAndMatch = async (buyer, packageBV) => {
  let currentParentId = buyer.parent;
  let currentPosition = buyer.position;

  // 1. Distribute BV up the parent tree
  while (currentParentId) {
    const parentNode = await User.findById(currentParentId);
    if (!parentNode) break;

    if (currentPosition === 'left') {
      parentNode.leftBV += packageBV;
    } else if (currentPosition === 'right') {
      parentNode.rightBV += packageBV;
    }

    await parentNode.save();

    // 2. Perform binary matching for this parent node
    // Check if both left and right BV are non-zero to match
    if (parentNode.leftBV > 0 && parentNode.rightBV > 0) {
      const matchBV = Math.min(parentNode.leftBV, parentNode.rightBV);
      // Binary matching pay = 10% of matching BV
      const binaryPay = Number((matchBV * 0.1).toFixed(2));

      parentNode.leftBV -= matchBV;
      parentNode.rightBV -= matchBV;
      parentNode.wallets.income += binaryPay;
      parentNode.wallets.main += binaryPay;
      await parentNode.save();

      await Transaction.create({
        user: parentNode._id,
        type: 'credit',
        amount: binaryPay,
        incomeType: 'Binary Matching',
        fromUser: buyer._id,
        description: `Binary Matching Income on ${matchBV} BV. Remaining Left: ${parentNode.leftBV} BV, Right: ${parentNode.rightBV} BV`,
        status: 'success',
      });

      await Notification.create({
        user: parentNode._id,
        title: 'Binary Income Credited',
        message: `You earned $${binaryPay} Binary Matching Income from matched ${matchBV} BV.`,
        type: 'income',
      });
    }

    // Move up the tree
    currentPosition = parentNode.position;
    currentParentId = parentNode.parent;
  }
};

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public (so users can view packages)
const getPackages = async (req, res) => {
  try {
    await seedPackages();
    const packages = await Package.find();
    res.json({ success: true, data: packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Buy package (Activate account)
// @route   POST /api/packages/buy
// @access  Private
const buyPackage = async (req, res) => {
  try {
    const { packageId } = req.body;

    const pack = await Package.findById(packageId);
    if (!pack) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const user = await User.findById(req.user._id);

    // Calculate cost
    const cost = pack.price;

    // Check balance: Recharge Wallet first, then Main Wallet, then combined
    let deductedFromRecharge = 0;
    let deductedFromMain = 0;

    if (user.wallets.recharge >= cost) {
      deductedFromRecharge = cost;
    } else {
      deductedFromRecharge = user.wallets.recharge;
      const remaining = cost - deductedFromRecharge;
      if (user.wallets.main >= remaining) {
        deductedFromMain = remaining;
      } else {
        return res.status(400).json({ success: false, message: 'Insufficient balance in wallet to purchase package' });
      }
    }

    // Deduct balances
    user.wallets.recharge -= deductedFromRecharge;
    user.wallets.main -= deductedFromMain;
    
    // Activate user status and package
    user.status = 'active';
    user.activePackage = pack._id;
    user.packageActivatedAt = new Date();
    user.totalROIPaid = 0;
    await user.save();

    // Create purchase transaction log
    await Transaction.create({
      user: user._id,
      type: 'debit',
      amount: cost,
      incomeType: 'Package Buy',
      description: `Purchased package: ${pack.name} ($${cost})`,
      status: 'success',
    });

    await Notification.create({
      user: user._id,
      title: 'Package Activated',
      message: `Your account is active! Purchased ${pack.name} for $${cost}.`,
      type: 'package',
    });

    // Run MLM Distribution logic asynchronously/sequentially
    await distributeDirectIncome(user, cost);
    await distributeLevelIncome(user, cost);
    await distributeBVAndMatch(user, pack.bv);

    // Return updated user data
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({
      success: true,
      message: `${pack.name} purchased and activated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPackages,
  buyPackage,
};
