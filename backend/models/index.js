const User = require('./User');
const Package = require('./Package');
const Transaction = require('./Transaction');
const Withdrawal = require('./Withdrawal');
const Notification = require('./Notification');
const OTPModel = require('./OTP');
const mockDb = require('./mockDb');

module.exports = {
  get User() {
    return global.useMockDb ? mockDb.User : User;
  },
  get Package() {
    return global.useMockDb ? mockDb.Package : Package;
  },
  get Transaction() {
    return global.useMockDb ? mockDb.Transaction : Transaction;
  },
  get Withdrawal() {
    return global.useMockDb ? mockDb.Withdrawal : Withdrawal;
  },
  get Notification() {
    return global.useMockDb ? mockDb.Notification : Notification;
  },
  get OTP() {
    return global.useMockDb ? mockDb.OTP : OTPModel;
  },
};
