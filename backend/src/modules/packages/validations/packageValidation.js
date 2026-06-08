class PackageValidation {
  validateCreate(req, res, next) {
    const { name, price, roi, bv, validity, maxIncome } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('Package name is required');
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      errors.push('Package price must be a positive number');
    }
    if (!roi || isNaN(roi) || Number(roi) <= 0) {
      errors.push('ROI percentage must be a positive number');
    }
    if (!bv || isNaN(bv) || Number(bv) <= 0) {
      errors.push('Business Volume (BV) must be a positive number');
    }
    if (!validity || isNaN(validity) || Number(validity) < 1) {
      errors.push('Validity must be at least 1 day');
    }
    if (!maxIncome || isNaN(maxIncome) || Number(maxIncome) <= 0) {
      errors.push('Maximum income ceiling must be a positive number');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    // Sanitize
    req.body.name = name.trim();
    req.body.price = Number(price);
    req.body.roi = Number(roi);
    req.body.bv = Number(bv);
    req.body.validity = Number(validity);
    req.body.maxIncome = Number(maxIncome);

    next();
  }

  validateUpdate(req, res, next) {
    const { name, price, roi, bv, validity, maxIncome } = req.body;
    const errors = [];

    if (price !== undefined && (isNaN(price) || Number(price) <= 0)) {
      errors.push('Package price must be a positive number');
    }
    if (roi !== undefined && (isNaN(roi) || Number(roi) <= 0)) {
      errors.push('ROI percentage must be a positive number');
    }
    if (bv !== undefined && (isNaN(bv) || Number(bv) <= 0)) {
      errors.push('Business Volume (BV) must be a positive number');
    }
    if (validity !== undefined && (isNaN(validity) || Number(validity) < 1)) {
      errors.push('Validity must be at least 1 day');
    }
    if (maxIncome !== undefined && (isNaN(maxIncome) || Number(maxIncome) <= 0)) {
      errors.push('Maximum income ceiling must be a positive number');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    next();
  }

  validateBuy(req, res, next) {
    const { packageId } = req.body;

    if (!packageId || typeof packageId !== 'string' || packageId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Package ID is required'
      });
    }

    req.body.packageId = packageId.trim();
    next();
  }
}

module.exports = new PackageValidation();
