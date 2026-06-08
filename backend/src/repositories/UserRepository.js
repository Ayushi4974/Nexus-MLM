const BaseRepository = require('./BaseRepository');
const User = require('../modules/users/models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByUsername(username, populate = '', session = null) {
    return await this.findOne({ username: username.toUpperCase() }, populate, '', session);
  }

  async findByEmail(email, session = null) {
    return await this.findOne({ email: email.toLowerCase() }, '', '', session);
  }

  async findByMobile(mobile, session = null) {
    return await this.findOne({ mobile }, '', '', session);
  }

  async getDirectTeam(userId, skip = 0, limit = 10, search = '', session = null) {
    const query = { sponsor: userId };
    if (search) {
      const term = search.toLowerCase();
      query.$or = [
        { username: { $regex: term, $options: 'i' } },
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } }
      ];
    }
    const users = await this.find(query, '', '-password', 'createdAt', limit, skip, session);
    const total = await this.countDocuments(query, session);
    return { users, total };
  }
}

module.exports = new UserRepository();
