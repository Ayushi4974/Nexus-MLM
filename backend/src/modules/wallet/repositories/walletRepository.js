const BaseRepository = require('../../../repositories/BaseRepository');
const User = require('../../../../models/User'); // Adjust path to User model

class WalletRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async getByUserId(userId) {
    return await this.findById(userId);
  }

  async updateWallets(userId, wallets, session = null) {
    // wallets is an object with any subset of wallet fields to update
    return await this.findByIdAndUpdate(userId, { $set: { wallets } }, { new: true, session });
  }
}

module.exports = new WalletRepository();
