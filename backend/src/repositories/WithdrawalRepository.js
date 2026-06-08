const BaseRepository = require('./BaseRepository');
const Withdrawal = require('../modules/withdrawals/models/Withdrawal');

class WithdrawalRepository extends BaseRepository {
  constructor() {
    super(Withdrawal);
  }

  async getWithdrawalsByUser(userId, skip = 0, limit = 10, session = null) {
    const query = { user: userId };
    const withdrawals = await this.find(query, '', '', '-createdAt', limit, skip, session);
    const total = await this.countDocuments(query, session);
    return { withdrawals, total };
  }
}

module.exports = new WithdrawalRepository();
