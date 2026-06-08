const { body, validationResult } = require('express-validator');

class WalletValidation {
  validateTransfer() {
    return [
      body('from')
        .isIn(['main', 'income', 'recharge', 'reward'])
        .withMessage('Invalid source wallet'),
      body('to')
        .isIn(['main', 'income', 'recharge', 'reward'])
        .withMessage('Invalid target wallet'),
      body('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
      }
    ];
  }

  validateWithdraw() {
    return [
      body('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
      body('bankDetails')
        .isObject()
        .withMessage('Bank details must be provided'),
      body('bankDetails.accountNumber')
        .isString()
        .notEmpty()
        .withMessage('Account number required'),
      body('bankDetails.ifsc')
        .isString()
        .notEmpty()
        .withMessage('IFSC code required'),
      body('bankDetails.bankName')
        .isString()
        .notEmpty()
        .withMessage('Bank name required'),
      body('bankDetails.holderName')
        .isString()
        .notEmpty()
        .withMessage('Account holder name required'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
      }
    ];
  }
}

module.exports = new WalletValidation();
