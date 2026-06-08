const roiService = require('../services/roiService');

class RoiController {
  /**
   * Admin endpoint to manually trigger daily ROI payout.
   * Returns the same summary as the service.
   */
  async runNow(req, res) {
    try {
      const result = await roiService.applyDailyRoi();
      res.json({ success: true, message: 'ROI processed', data: result });
    } catch (err) {
      console.error('Error running ROI:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new RoiController();
