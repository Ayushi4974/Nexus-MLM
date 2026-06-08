const BaseRepository = require('./BaseRepository');
const Notification = require('../modules/notifications/models/Notification');

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async getUnreadByUser(userId, session = null) {
    return await this.find({ user: userId, isRead: false }, '', '', '-createdAt', null, null, session);
  }

  async markAllAsRead(userId, session = null) {
    return await this.updateMany({ user: userId, isRead: false }, { isRead: true }, session);
  }
}

module.exports = new NotificationRepository();
