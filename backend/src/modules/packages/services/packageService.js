const mongoose = require('mongoose');
const PackageRepository = require('../../../repositories/PackageRepository');
const UserRepository = require('../../../repositories/UserRepository');
const TransactionRepository = require('../../../repositories/TransactionRepository');
const NotificationRepository = require('../../../repositories/NotificationRepository');
const AuditLogRepository = require('../../../repositories/AuditLogRepository');

class PackageService {
  // ─── Admin CRUD ─────────────────────────────────────────────────────────────

  async createPackage(data) {
    const existing = await PackageRepository.findByName(data.name);
    if (existing) {
      throw new Error(`Package with name "${data.name}" already exists`);
    }
    return await PackageRepository.create(data);
  }

  async updatePackage(packageId, data) {
    const pkg = await PackageRepository.findById(packageId);
    if (!pkg) {
      throw new Error('Package not found');
    }

    // Prevent name duplication if renaming
    if (data.name && data.name !== pkg.name) {
      const nameConflict = await PackageRepository.findByName(data.name);
      if (nameConflict) {
        throw new Error(`Package name "${data.name}" is already taken`);
      }
    }

    return await PackageRepository.findByIdAndUpdate(packageId, data);
  }

  async deletePackage(packageId) {
    const pkg = await PackageRepository.findById(packageId);
    if (!pkg) {
      throw new Error('Package not found');
    }
    await PackageRepository.deleteOne({ _id: packageId });
    return { message: `Package "${pkg.name}" deleted successfully` };
  }

  async getAllPackages() {
    return await PackageRepository.find({}, '', '', 'price');
  }

  async getPackageById(packageId) {
    const pkg = await PackageRepository.findById(packageId);
    if (!pkg) {
      throw new Error('Package not found');
    }
    return pkg;
  }

  // ─── User Purchase / Upgrade ─────────────────────────────────────────────────

  async buyPackage(userId, packageId) {
    // 1. Fetch target package
    const newPkg = await PackageRepository.findById(packageId);
    if (!newPkg) {
      throw new Error('Package not found');
    }

    // 2. Fetch user record
    const user = await UserRepository.findById(userId, 'activePackage');
    if (!user) {
      throw new Error('User not found');
    }

    // 3. Upgrade rules enforcement
    if (user.activePackage) {
      const currentPkg = await PackageRepository.findById(user.activePackage);
      if (currentPkg) {
        if (newPkg.price <= currentPkg.price) {
          throw new Error(
            `Cannot downgrade or repurchase the same package. ` +
            `Current: "${currentPkg.name}" (₹${currentPkg.price}). ` +
            `Select a higher-priced package.`
          );
        }
      }
    }

    // 4. Wallet balance validation — check Recharge Wallet first, then Main Wallet
    const totalAvailable = user.wallets.recharge + user.wallets.main;
    if (totalAvailable < newPkg.price) {
      throw new Error(
        `Insufficient wallet balance. Required: ₹${newPkg.price}, ` +
        `Available: ₹${totalAvailable.toFixed(2)} (Recharge: ₹${user.wallets.recharge} + Main: ₹${user.wallets.main})`
      );
    }

    // 5. Deduct from wallets: Recharge first, then Main
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let remaining = newPkg.price;

      if (user.wallets.recharge >= remaining) {
        user.wallets.recharge = parseFloat((user.wallets.recharge - remaining).toFixed(2));
        remaining = 0;
      } else {
        remaining -= user.wallets.recharge;
        user.wallets.recharge = 0;
        user.wallets.main = parseFloat((user.wallets.main - remaining).toFixed(2));
        remaining = 0;
      }

      // 6. Activate package
      user.activePackage = newPkg._id;
      user.status = 'active';
      user.packageActivatedAt = new Date();
      user.totalROIPaid = 0; // Reset ROI tracker on new package

      await user.save({ session });

      // 7. Log wallet debit transaction
      await TransactionRepository.create(
        {
          user: userId,
          amount: newPkg.price,
          type: 'debit',
          wallet: 'main',
          incomeType: null,
          description: `Package Purchase: ${newPkg.name} (₹${newPkg.price})`
        },
        session
      );

      // 8. Create notification
      await NotificationRepository.create(
        {
          user: userId,
          title: 'Package Activated',
          message: `Your "${newPkg.name}" package has been activated. Daily ROI of ${newPkg.roi}% will be credited to your Income Wallet.`
        },
        session
      );

      // 9. Audit log
      await AuditLogRepository.log(
        userId,
        'PACKAGE_PURCHASE',
        { packageId: newPkg._id, packageName: newPkg.name, amount: newPkg.price },
        '', '',
        session
      );

      await session.commitTransaction();
      session.endSession();

      return {
        message: `Package "${newPkg.name}" activated successfully`,
        package: {
          _id: newPkg._id,
          name: newPkg.name,
          price: newPkg.price,
          roi: newPkg.roi,
          validity: newPkg.validity,
          maxIncome: newPkg.maxIncome
        },
        wallets: user.wallets,
        status: user.status
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}

module.exports = new PackageService();
