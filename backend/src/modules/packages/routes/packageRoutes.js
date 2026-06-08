const express = require('express');
const router = express.Router();

const packageController = require('../controllers/packageController');
const packageValidation = require('../validations/packageValidation');
const { protect, protectAdmin } = require('../../../middleware/auth'); // Assuming common auth middleware path

// ---------- Admin Routes (CRUD) ----------
router.post('/', protectAdmin, packageValidation.validateCreate, packageController.createPackage);
router.put('/:id', protectAdmin, packageValidation.validateUpdate, packageController.updatePackage);
router.delete('/:id', protectAdmin, packageController.deletePackage);

// ---------- Public/User Routes ----------
router.get('/', protect, packageController.getAllPackages);
router.get('/:id', protect, packageController.getPackageById);
router.post('/buy', protect, packageValidation.validateBuy, packageController.buyPackage);

module.exports = router;
