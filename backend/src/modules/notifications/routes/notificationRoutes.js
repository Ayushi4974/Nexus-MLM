const express = require('express');
const router = express.Router();
const { protect } = require('../../../../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

router.get('/', notificationController.listNotifications);
router.post('/mark-read', notificationController.markRead);
router.post('/mark-all-read', notificationController.markAllRead);

module.exports = router;
