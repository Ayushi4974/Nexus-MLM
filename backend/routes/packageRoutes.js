const express = require('express');
const router = express.Router();
const {
  getPackages,
  buyPackage,
} = require('../controllers/packageController');
const { protect } = require('../middleware/authMiddleware');
const packageValidation = require('../src/modules/packages/validations/packageValidation');

router.get('/', getPackages);
router.post('/buy', protect, buyPackage);

module.exports = router;
