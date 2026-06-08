const BaseRepository = require('./BaseRepository');
const AuditLog = require('../modules/admin/models/AuditLog');

class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }

  async log(userId, action, details = {}, ipAddress = '', userAgent = '', session = null) {
    return await this.create({
      user: userId,
      action,
      details,
      ipAddress,
      userAgent
    }, session);
  }
}

module.exports = new AuditLogRepository();
