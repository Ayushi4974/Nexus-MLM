const BaseRepository = require('./BaseRepository');
const Transaction = require('../modules/transactions/models/Transaction');

class TransactionRepository extends BaseRepository {
  constructor() {
    super(Transaction);
  }

  async getTransactionsByUser(userId, filters = {}, skip = 0, limit = 10, session = null) {
    const query = { user: userId };
    
    if (filters.wallet) {
      query.wallet = filters.wallet;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.incomeType) {
      query.incomeType = filters.incomeType;
    }

    const txs = await this.find(query, 'fromUser', '', '-createdAt', limit, skip, session);
    const total = await this.countDocuments(query, session);
    return { txs, total };
  }
}

module.exports = new TransactionRepository();
