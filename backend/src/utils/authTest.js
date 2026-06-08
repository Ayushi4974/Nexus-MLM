require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const AuthService = require('../modules/auth/services/authService');
const UserRepository = require('../repositories/UserRepository');
const TokenService = require('../modules/auth/services/tokenService');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`[PASS] ${message}`);
}

async function runTests() {
  console.log('--- STARTING AUTHENTICATION & PLACEMENT TESTS ---');

  // 1. Connection
  await connectDB();
  assert(mongoose.connection.readyState === 1, 'Connected to MongoDB.');

  // Clean test DB
  await mongoose.connection.dropDatabase();
  console.log('[Database] Cleaned database for clean auth testing.');

  // 2. Register Root User (First User)
  console.log('\n--- Inserting Root Node ---');
  const root = await AuthService.register({
    name: 'Admin Root',
    email: 'root@nexusmlm.com',
    mobile: '9000000001',
    password: 'Password123'
  });
  assert(root && root._id, 'Root user registered.');
  assert(root.position === 'root', 'Root user position set to "root".');
  assert(root.parentId === '', 'Root user parentId is empty.');

  // 3. Register children (2nd to 7th nodes) to form a balanced tree
  console.log('\n--- Inserting Children Nodes via BFS ---');
  
  const nodes = [];
  // Insert 6 child nodes under Root
  for (let i = 2; i <= 7; i++) {
    const node = await AuthService.register({
      name: `User Node ${i}`,
      email: `node${i}@nexusmlm.com`,
      mobile: `900000000${i}`,
      password: 'Password123',
      sponsorId: root.username // Sponsor is Root
    });
    nodes.push(node);
    console.log(`[Inserted] ${node.username} under parent ${node.parentId} at position: ${node.position}`);
  }

  // Retrieve updated user documents from db
  const uRoot = await UserRepository.findById(root._id);
  const u2 = await UserRepository.findOne({ username: nodes[0].username }); // MLMXXXXX2
  const u3 = await UserRepository.findOne({ username: nodes[1].username });
  const u4 = await UserRepository.findOne({ username: nodes[2].username });
  const u5 = await UserRepository.findOne({ username: nodes[3].username });
  const u6 = await UserRepository.findOne({ username: nodes[4].username });
  const u7 = await UserRepository.findOne({ username: nodes[5].username });

  // 4. Assert BFS balanced placement order:
  // Node 2 -> Left Child of Root
  assert(u2.parentId === uRoot.username && u2.position === 'left', 'Node 2 placed at Root -> Left.');
  // Node 3 -> Right Child of Root
  assert(u3.parentId === uRoot.username && u3.position === 'right', 'Node 3 placed at Root -> Right.');
  // Node 4 -> Left Child of Node 2
  assert(u4.parentId === u2.username && u4.position === 'left', 'Node 4 placed at Node 2 -> Left.');
  // Node 5 -> Right Child of Node 2
  assert(u5.parentId === u2.username && u5.position === 'right', 'Node 5 placed at Node 2 -> Right.');
  // Node 6 -> Left Child of Node 3
  assert(u6.parentId === u3.username && u6.position === 'left', 'Node 6 placed at Node 3 -> Left.');
  // Node 7 -> Right Child of Node 3
  assert(u7.parentId === u3.username && u7.position === 'right', 'Node 7 placed at Node 3 -> Right.');

  // 5. Assert Ancestry Counts (`leftCount`/`rightCount` increments):
  console.log('\n--- Validating Ancestry Counts ---');
  // Root should have 3 left, 3 right
  assert(uRoot.leftCount === 3, `Root left subtree size is 3 (got: ${uRoot.leftCount}).`);
  assert(uRoot.rightCount === 3, `Root right subtree size is 3 (got: ${uRoot.rightCount}).`);
  
  // Node 2 should have 1 left, 1 right
  assert(u2.leftCount === 1, `Node 2 left subtree size is 1 (got: ${u2.leftCount}).`);
  assert(u2.rightCount === 1, `Node 2 right subtree size is 1 (got: ${u2.rightCount}).`);

  // Node 3 should have 1 left, 1 right
  assert(u3.leftCount === 1, `Node 3 left subtree size is 1 (got: ${u3.leftCount}).`);
  assert(u3.rightCount === 1, `Node 3 right subtree size is 1 (got: ${u3.rightCount}).`);

  // 6. Test User Login
  console.log('\n--- Testing Login Credentials Authentication ---');
  try {
    const loginResult = await AuthService.login(root.username, 'Password123');
    assert(loginResult && loginResult.token, 'Login successful with Username.');
    
    const tokenDecoded = TokenService.verifyToken(loginResult.token);
    assert(tokenDecoded.id.toString() === root._id.toString(), 'JWT token successfully encodes userID.');
  } catch (err) {
    assert(false, `Login failed: ${err.message}`);
  }

  // Validate password mismatch
  try {
    await AuthService.login(root.username, 'WrongPassword');
    assert(false, 'Login should fail with incorrect password.');
  } catch (err) {
    assert(err.message === 'Invalid login credentials', 'Authentication successfully rejected incorrect password.');
  }

  // 7. Verify Sponsor Lookups
  console.log('\n--- Testing Sponsor Verification ---');
  const sponsorCheck = await AuthService.verifySponsor(root.username);
  assert(sponsorCheck.name === 'Admin Root', 'Sponsor name verified successfully.');

  // 8. Verify Placement Vacancies Check
  console.log('\n--- Testing Parent Placement Checks ---');
  // Node 4 has no children yet, positions should be vacant
  const leftVacant = await AuthService.verifyParent(u4.username, 'left');
  assert(leftVacant.success === true, 'Node 4 left position reported vacant.');

  // Root has occupied left child (Node 2), check should reject
  try {
    await AuthService.verifyParent(uRoot.username, 'left');
    assert(false, 'Placement check should fail if node is occupied.');
  } catch (err) {
    assert(err.message.includes('occupied'), 'Placement check successfully rejects occupied slot.');
  }

  console.log('\n--- ALL AUTHENTICATION & PLACEMENT TESTS PASSED ---');
  mongoose.connection.close();
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n[FAIL] Test suite crashed:', err.message);
  mongoose.connection.close();
  process.exit(1);
});
