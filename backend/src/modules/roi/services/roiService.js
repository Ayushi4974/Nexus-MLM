const mongoose = require('mongoose');
const User = require('../../../models/User');
const Package = require('../../../models/Package');
const Transaction = require('../../../models/Transaction');
const Notification = require('../../../models/Notification');
const RoiLog = require('../models/roiLog');

class RoiService {
  /**
   * Apply daily ROI to all eligible users.
   * Returns summary { processedCount, totalYieldDistributed }
   */
  async applyDailyRoi() {
    const users = await User.find({ status: 'active' });
    const packages = await Package.find({});
    let processedCount = 0;
    let totalYieldDistributed = 0;

    for (let user of users) {
      if (!user.activePackage) continue;
      const pkgId = user.activePackage._id || user.activePackage;
      const pkg = packages.find(p => p._id.toString() === pkgId.toString());
      if (!pkg) continue;

      // Check package validity based on activation date
      if (user.packageActivatedAt) {
        const daysActive = Math.floor((new Date() - new Date(user.packageActivatedAt)) / (1000 * 60 * 60 * 24));
        if (daysActive >= pkg.validity) {
          // expire package
          user.activePackage = null;
          user.status = 'inactive';
          await user.save();
          await Notification.create({
            user: user._id,
            title: 'Package Expired',
            message: `Your package ${pkg.name} has expired after ${pkg.validity} days.`
          });
          continue;
        }
      }

      // Check max income cap
      const paidSoFar = user.totalROIPaid || 0;
      if (paidSoFar >= pkg.maxIncome) {
        user.activePackage = null;
        user.status = 'inactive';
        await user.save();
        await Notification.create({
          user: user._id,
          title: 'Package Capped',
          message: `Your package ${pkg.name} reached its max income limit of $${pkg.maxIncome}.`
        });
        continue;
      }

      // Calculate daily ROI amount
      const dailyYieldRaw = pkg.price * (pkg.roi / 100);
      let dailyYield = Number(dailyYieldRaw.toFixed(2));
      // Adjust for cap
      if (paidSoFar + dailyYield > pkg.maxIncome) {
        dailyYield = Number((pkg.maxIncome - paidSoFar).toFixed(2));
      }

      if (dailyYield > 0) {
        // Update user wallets atomically (no session needed here because single doc)
        user.totalROIPaid = Number((paidSoFar + dailyYield).toFixed(2));
        user.wallets.income = Number((user.wallets.income + dailyYield).toFixed(2));
        // Optionally also credit main wallet as per earlier admin code
        user.wallets.main = Number((user.wallets.main + dailyYield).toFixed(2));
        await user.save();

        // Transaction record
        await Transaction.create({
          user: user._id,
          amount: dailyYield,
          type: 'credit',
          incomeType: 'ROI Income',
          description: `Daily ROI payout from ${pkg.name}`
        });

        // Log ROI entry for audit
        await RoiLog.create({
          user: user._id,
          package: pkg._id,
          roiPercent: pkg.roi,
          amount: dailyYield
        });

        // Notify user
        await Notification.create({
          user: user._id,
          title: 'Daily ROI Credited',
          message: `You earned $${dailyYield} ROI (${pkg.roi}% of $${pkg.price}) from ${pkg.name}.`
        });

        processedCount++;
        totalYieldDistributed += dailyYield;
      }
    }

    return { processedCount, totalYieldDistributed };
  }
}

module.exports = new RoiService();
