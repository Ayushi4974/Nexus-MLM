const NotificationRepository = require('../../../repositories/NotificationRepository');
const nodemailer = require('nodemailer');

// Simple email transporter (configure with real credentials in .env)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
});

/**
 * Sends an email notification if email channel is enabled.
 */
async function sendEmail(to, subject, text) {
  if (!process.env.ENABLE_EMAIL || process.env.ENABLE_EMAIL !== 'true') return;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@example.com',
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('Email send error:', err);
  }
}

/**
 * Emits real-time notification via Socket.io.
 */
function emitRealtime(notification) {
  if (global.io) {
    global.io.to(notification.user.toString()).emit('notification', notification);
  }
}

/**
 * Creates a notification, stores it, emits realtime, and optionally emails.
 */
async function createNotification({ userId, title, message, type, metadata = {} }) {
  // Persist to DB
  const notif = await NotificationRepository.create({
    user: userId,
    title,
    message,
    type,
    metadata,
  });

  // Emit via Socket.io (room = userId)
  emitRealtime(notif);

  // Email if needed – assume user email can be fetched elsewhere; placeholder
  // In real implementation, fetch user email from User model.
  // await sendEmail(userEmail, title, message);

  return notif;
}

// Retrieves paginated notifications for a user
async function getUserNotifications(userId, { skip = 0, limit = 20 } = {}) {
  const notifications = await NotificationRepository.find({ user: userId }, '', '', '-createdAt', limit, skip);
  return notifications;
}

// Marks a single notification as read
async function markAsRead(notificationId) {
  return await NotificationRepository.updateOne({ _id: notificationId }, { isRead: true });
}

// Marks all notifications for a user as read
async function markAllAsRead(userId) {
  return await NotificationRepository.updateMany({ user: userId, isRead: false }, { isRead: true });
}

module.exports = {
  createNotification,
  sendEmail,
  emitRealtime,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
