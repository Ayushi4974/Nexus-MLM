const notificationService = require('../services/notificationService');

// GET /notifications - list user's notifications (supports pagination)
async function listNotifications(req, res) {
  const userId = req.user.id; // assuming auth middleware sets req.user
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const notifications = await notificationService.getUserNotifications(userId, { skip, limit: parseInt(limit) });
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('List notifications error', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /notifications/mark-read - mark a single notification as read
async function markRead(req, res) {
  const { notificationId } = req.body;
  try {
    const updated = await notificationService.markAsRead(notificationId);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Mark read error', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /notifications/mark-all-read - mark all notifications for user as read
async function markAllRead(req, res) {
  const userId = req.user.id;
  try {
    await notificationService.markAllAsRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
};
