const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserNotifications,
  markNotificationsRead,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Secure all routes in this file

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.put('/change-password', changePassword);

router.route('/notifications')
  .get(getUserNotifications)
  .put(markNotificationsRead);

module.exports = router;
