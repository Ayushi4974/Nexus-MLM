const { User } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../src/services/tokenService');
const { comparePassword } = require('../src/utils/password');
// Generate JWT Token
// Removed legacy generateToken; using tokenService

// Helper function to recursively update left/right member count up the tree
const updateAncestorsCount = async (parentObjId, childPosition) => {
  let currentParentId = parentObjId;
  let currentPosition = childPosition;

  while (currentParentId) {
    const parentNode = await User.findById(currentParentId);
    if (!parentNode) break;

    if (currentPosition === 'left') {
      parentNode.leftCount += 1;
    } else if (currentPosition === 'right') {
      parentNode.rightCount += 1;
    }

    await parentNode.save();

    // Prepare next loop iteration
    // The position of the current parent relative to ITS parent determines the next update
    currentPosition = parentNode.position;
    currentParentId = parentNode.parent;
  }
};

// Helper function to perform Breadth-First Search (BFS) and find the first vacant binary tree spot under a sponsor
const findVacantParentAndPosition = async (sponsorObjId) => {
  const queue = [sponsorObjId];

  while (queue.length > 0) {
    const currentObjId = queue.shift();

    // Check left branch
    const leftChild = await User.findOne({ parent: currentObjId, position: 'left' });
    if (!leftChild) {
      return { parentObjId: currentObjId, position: 'left' };
    }

    // Check right branch
    const rightChild = await User.findOne({ parent: currentObjId, position: 'right' });
    if (!rightChild) {
      return { parentObjId: currentObjId, position: 'right' };
    }

    // Both occupied, push to queue to search lower levels
    queue.push(leftChild._id);
    queue.push(rightChild._id);
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, sponsorId } = req.body;

    // Validate inputs
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    // Check if user exists
    const emailExists = await User.findOne({ email });
    const mobileExists = await User.findOne({ mobile });

    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    if (mobileExists) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    // Check if this is the first user (Root)
    const userCount = await User.countDocuments();
    let sponsorRef = null;
    let parentRef = null;
    let finalPosition = 'left';
    let parentUsername = '';

    if (userCount > 0) {
      // Find the sponsor — either by given ID or fall back to root user
      let sponsorUser = null;

      if (sponsorId) {
        sponsorUser = await User.findOne({ username: { $regex: new RegExp(`^${sponsorId}$`, 'i') } });
      }

      // If no sponsor found (or no sponsorId given), use root user as sponsor
      if (!sponsorUser) {
        // Find root user (first user / position=root or just the first user)
        const allUsers = await User.find({});
        sponsorUser = allUsers.find(u => u.position === 'root') || allUsers[0];
      }

      if (!sponsorUser) {
        return res.status(400).json({ success: false, message: 'No root user found. Please register the first user without a sponsor.' });
      }

      sponsorRef = sponsorUser._id;

      // Auto Placement Logic (BFS)
      const vacantSpot = await findVacantParentAndPosition(sponsorUser._id);
      parentRef = vacantSpot.parentObjId;
      finalPosition = vacantSpot.position;

      // Retrieve parent user to save parent ID
      const parentUser = await User.findById(parentRef);
      parentUsername = parentUser ? parentUser.username : '';
    } else {
      // Root user setup
      sponsorRef = null;
      parentRef = null;
      finalPosition = 'root';
      parentUsername = '';
    }

    // Generate unique username: e.g., MLM + 6 random digits
    let isUnique = false;
    let username = '';
    while (!isUnique) {
      const randVal = Math.floor(100000 + Math.random() * 900000);
      username = `MLM${randVal}`;
      const existing = await User.findOne({ username });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create User
    const user = await User.create({
      username,
      name,
      email,
      mobile,
      password,
      sponsor: sponsorRef,
      sponsorId: sponsorId || '',
      parent: parentRef,
      parentId: parentUsername || '',
      position: finalPosition,
      status: 'inactive', // inactive until packages purchased
    });

    if (user) {
      // If we have parent, recursively update upline counter
      if (parentRef) {
        await updateAncestorsCount(parentRef, finalPosition);
      }

      const token = generateAccessToken(user._id);
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          sponsorId: user.sponsorId,
          parentId: user.parentId,
          position: user.position,
          isAdmin: user.isAdmin,
          accessToken: token,
          token: token,
          refreshToken: generateRefreshToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body; // loginId can be email, mobile, or username

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username/mobile and password' });
    }

    // Find user by username, email or mobile
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${loginId}$`, 'i') } },
        { email: loginId.toLowerCase() },
        { mobile: loginId }
      ],
    });

    if (user && (await comparePassword(password, user.password))) {
      const token = generateAccessToken(user._id);
      res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          sponsorId: user.sponsorId,
          parentId: user.parentId,
          position: user.position,
          status: user.status,
          isAdmin: user.isAdmin,
          accessToken: token,
          token: token,
          refreshToken: generateRefreshToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify sponsor ID
// @route   GET /api/auth/verify-sponsor/:sponsorId
// @access  Public
const verifySponsor = async (req, res) => {
  try {
    const sponsorId = (req.params.sponsorId || '').toUpperCase();

    // Built-in demo/seed sponsor IDs — always valid for testing
    const DEMO_SPONSORS = {
      'MLM000001': 'Admin Root',
      'MLM000002': 'Demo Sponsor Alpha',
      'MLM000003': 'Demo Sponsor Beta',
      'MLM100001': 'Raj Kumar',
      'MLM100002': 'Priya Sharma',
      'MLM888888': 'Admin Root Member',
    };

    if (DEMO_SPONSORS[sponsorId]) {
      return res.status(200).json({ success: true, name: DEMO_SPONSORS[sponsorId] });
    }

    const user = await User.findOne({ username: { $regex: new RegExp(`^${sponsorId}$`, 'i') } });
    if (user) {
      res.status(200).json({ success: true, name: user.name });
    } else {
      res.status(404).json({ success: false, message: 'Sponsor ID not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify parent placement vacancy
// @route   GET /api/auth/verify-parent
// @access  Public
const verifyParent = async (req, res) => {
  try {
    const { parentId, position } = req.query;

    const parent = await User.findOne({ username: { $regex: new RegExp(`^${parentId}$`, 'i') } });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent ID not found' });
    }

    const occupied = await User.findOne({ parent: parent._id, position });
    if (occupied) {
      return res.status(400).json({
        success: false,
        message: `Placement position (${position}) is already occupied by ${occupied.username}`,
      });
    }

    res.status(200).json({ success: true, message: 'Placement position is vacant', parentName: parent.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifySponsor,
  verifyParent,
};
