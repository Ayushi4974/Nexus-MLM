require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import repositories
const UserRepository = require('../repositories/UserRepository');
const PackageRepository = require('../repositories/PackageRepository');
const TransactionRepository = require('../repositories/TransactionRepository');
const WithdrawalRepository = require('../repositories/WithdrawalRepository');
const NotificationRepository = require('../repositories/NotificationRepository');
const AuditLogRepository = require('../repositories/AuditLogRepository');

// Helper to run assertions
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`[PASS] ${message}`);
}

async function runTests() {
  console.log('--- STARTING DATABASE VALIDATION TESTS ---');

  // 1. Database Connection
  await connectDB();
  assert(mongoose.connection.readyState === 1, 'MongoDB connection established successfully.');

  // Clean test collection records
  await mongoose.connection.dropDatabase();
  console.log('[Database] Test database cleaned.');

  // 2. Validate Package Schema & Repository
  console.log('\n--- Testing Package Schema & Repository ---');
  let starterPkg;
  try {
    starterPkg = await PackageRepository.create({
      name: 'Starter Pack',
      price: 1000,
      roi: 1.0,
      bv: 100,
      validity: 100,
      maxIncome: 2000
    });
    assert(starterPkg && starterPkg._id, 'Package document created successfully.');
  } catch (err) {
    assert(false, `Package creation failed: ${err.message}`);
  }

  // Price validation check
  try {
    await PackageRepository.create({
      name: 'Invalid Pack',
      price: -50,
      roi: 1.0,
      bv: 10,
      validity: 30,
      maxIncome: 100
    });
    assert(false, 'Mongoose should have failed validation for negative price package.');
  } catch (err) {
    assert(err.errors.price, 'Mongoose successfully rejected negative price package.');
  }

  // 3. Validate User Schema & Repository
  console.log('\n--- Testing User Schema & Repository ---');
  let testUser;
  try {
    testUser = await UserRepository.create({
      username: 'MLM123456',
      name: 'John Doe',
      email: 'john.doe@test.com',
      mobile: '+919876543210',
      password: 'securepassword123',
      position: 'left',
      wallets: { main: 500, income: 0, recharge: 100, reward: 0 }
    });
    assert(testUser && testUser._id, 'User document created successfully.');
    assert(testUser.username === 'MLM123456', 'Username formatted to uppercase.');
  } catch (err) {
    assert(false, `User creation failed: ${err.message}`);
  }

  // Verify pre-save password hash
  assert(testUser.password !== 'securepassword123', 'Password successfully hashed before saving.');
  const passwordMatch = await testUser.matchPassword('securepassword123');
  assert(passwordMatch === true, 'Bcrypt compare check matches correct password.');
  const passwordMismatch = await testUser.matchPassword('wrongpassword');
  assert(passwordMismatch === false, 'Bcrypt compare check rejects incorrect password.');

  // Username validation check
  try {
    await UserRepository.create({
      username: 'INVALID-NAME',
      name: 'Jane Doe',
      email: 'jane@test.com',
      mobile: '+919999999999',
      password: 'password123'
    });
    assert(false, 'Mongoose should have rejected invalid username format.');
  } catch (err) {
    assert(err.errors.username, 'Mongoose successfully rejected invalid username format.');
  }

  // Duplicate email check
  try {
    await UserRepository.create({
      username: 'MLM999999',
      name: 'Clone User',
      email: 'john.doe@test.com', // Duplicate email
      mobile: '+918888888888',
      password: 'password123'
    });
    assert(false, 'Mongoose should have rejected duplicate email.');
  } catch (err) {
    assert(err.code === 11000, 'MongoDB index successfully rejected duplicate email.');
  }

  // Negative wallet balance check
  try {
    await UserRepository.create({
      username: 'MLM111111',
      name: 'Broke User',
      email: 'broke@test.com',
      mobile: '+917777777777',
      password: 'password123',
      wallets: { main: -10 } // Negative wallet balance
    });
    assert(false, 'Mongoose should have rejected negative wallet balance.');
  } catch (err) {
    assert(err.errors['wallets.main'], 'Mongoose successfully rejected negative wallet balance.');
  }

  // 4. Validate Transaction Schema & Repository
  console.log('\n--- Testing Transaction Schema & Repository ---');
  try {
    const tx = await TransactionRepository.create({
      user: testUser._id,
      amount: 100,
      type: 'credit',
      wallet: 'main',
      incomeType: 'transfer',
      description: 'Test Wallet Credit'
    });
    assert(tx && tx._id, 'Transaction document created successfully.');
  } catch (err) {
    assert(false, `Transaction creation failed: ${err.message}`);
  }

  // 5. Validate Withdrawal Schema & Repository
  console.log('\n--- Testing Withdrawal Schema & Repository ---');
  try {
    const wth = await WithdrawalRepository.create({
      user: testUser._id,
      amount: 1000,
      charges: {
        processingFee: 50,
        tds: 50,
        totalDeduction: 100
      },
      netAmount: 900,
      status: 'pending'
    });
    assert(wth && wth._id, 'Withdrawal document created successfully.');
  } catch (err) {
    assert(false, `Withdrawal creation failed: ${err.message}`);
  }

  // Under limit check (₹500 min)
  try {
    await WithdrawalRepository.create({
      user: testUser._id,
      amount: 200, // less than 500
      charges: { processingFee: 10, tds: 10, totalDeduction: 20 },
      netAmount: 180
    });
    assert(false, 'Mongoose should have rejected withdrawal below ₹500.');
  } catch (err) {
    assert(err.errors.amount, 'Mongoose successfully rejected withdrawal below ₹500.');
  }

  // 6. Validate Notification Schema & Repository
  console.log('\n--- Testing Notification Schema & Repository ---');
  try {
    const notif = await NotificationRepository.create({
      user: testUser._id,
      title: 'Test Notification',
      message: 'This is a test notification.'
    });
    assert(notif && notif._id, 'Notification document created successfully.');
  } catch (err) {
    assert(false, `Notification creation failed: ${err.message}`);
  }

  // 7. Validate AuditLog Schema & Repository
  console.log('\n--- Testing AuditLog Schema & Repository ---');
  try {
    const log = await AuditLogRepository.log(
      testUser._id,
      'LOGIN',
      { ip: '127.0.0.1' },
      '127.0.0.1',
      'Mozilla/Chrome'
    );
    assert(log && log._id, 'Audit log document created successfully.');
  } catch (err) {
    assert(false, `Audit log creation failed: ${err.message}`);
  }

  console.log('\n--- ALL PHASE 1 DATABASE TESTS PASSED ---');
  mongoose.connection.close();
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n[FAIL] Test suite crashed:', err.message);
  mongoose.connection.close();
  process.exit(1);
});
