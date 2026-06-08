const express = require('express');
const router = express.Router();
const { protect, protectAdmin } = require('../middleware/authMiddleware');
const roiController = require('../src/modules/roi/controllers/roiController');

// Admin endpoint to manually trigger ROI payout
router.get('/run', protect, protectAdmin, roiController.runNow);

module.exports = router;
