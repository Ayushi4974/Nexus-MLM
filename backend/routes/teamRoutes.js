const express = require('express');
const router = express.Router();
const {
  getDirectTeam,
  getGenealogyTree,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/direct', getDirectTeam);
router.get('/genealogy', getGenealogyTree);

module.exports = router;
