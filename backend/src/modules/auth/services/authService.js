const mongoose = require('mongoose');
const UserRepository = require('../../../repositories/UserRepository');
const PlacementService = require('../../mlm/services/placementService');
const TokenService = require('./tokenService');
const AuditLogRepository = require('../../../repositories/AuditLogRepository');

class AuthService {
  async register(userData) {
    const { name, email, mobile, password, sponsorId } = userData;

    // Check if email or mobile are already registered
    const emailExists = await UserRepository.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      throw new Error('Email is already registered');
    }

    const mobileExists = await UserRepository.findOne({ mobile });
    if (mobileExists) {
      throw new Error('Mobile number is already registered');
    }

    // Determine sponsor and placement parent node
    const userCount = await UserRepository.countDocuments({});
    let sponsorRef = null;
    let parentRef = null;
    let finalPosition = 'root';
    let parentUsername = '';
    let sponsorUsername = '';

    if (userCount > 0) {
      let sponsorUser = null;

      if (sponsorId) {
        sponsorUser = await UserRepository.findOne({ username: sponsorId.toUpperCase() });
        if (!sponsorUser) {
          throw new Error('Specified Sponsor ID not found');
        }
      } else {
        // Fall back to root node (the user with position 'root')
        sponsorUser = await UserRepository.findOne({ position: 'root' });
        if (!sponsorUser) {
          // If no root user, default to the first user created in the database
          const allUsers = await UserRepository.find({}, '', '', 'createdAt', 1);
          sponsorUser = allUsers[0];
        }
      }

      if (!sponsorUser) {
        throw new Error('Sponsor is required. No root node exists.');
      }

      sponsorRef = sponsorUser._id;
      sponsorUsername = sponsorUser.username;

      // Locate placement vacancy
      const vacantSpot = await PlacementService.findPlacementBFS(sponsorUser._id);
      parentRef = vacantSpot.parentObjId;
      finalPosition = vacantSpot.position;

      // Retrieve parent node details
      const parentUser = await UserRepository.findById(parentRef);
      parentUsername = parentUser ? parentUser.username : '';
    } else {
      // Create root user node
      sponsorRef = null;
      parentRef = null;
      finalPosition = 'root';
      parentUsername = '';
      sponsorUsername = '';
    }

    // Generate unique random username: MLM + 6 digits
    let isUnique = false;
    let username = '';
    while (!isUnique) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      username = `MLM${rand}`;
      const existing = await UserRepository.findOne({ username });
      if (!existing) {
        isUnique = true;
      }
    }

    // Write database operation inside a transaction block to guarantee atomic updates
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newUser = await UserRepository.create(
        {
          username,
          name,
          email: email.toLowerCase(),
          mobile,
          password, // Mongoose hook automatically hashes this
          sponsor: sponsorRef,
          sponsorId: sponsorUsername,
          parent: parentRef,
          parentId: parentUsername,
          position: finalPosition,
          status: 'inactive', // defaults to inactive until activated
          wallets: { main: 0, income: 0, recharge: 0, reward: 0 }
        },
        session
      );

      // Recursively increment leftCount/rightCount up the upline parent nodes
      if (parentRef) {
        await PlacementService.updateAncestorsCount(parentRef, finalPosition, session);
      }

      // Log audit trace
      await AuditLogRepository.log(
        newUser._id,
        'REGISTER',
        { username: newUser.username, sponsorId: sponsorUsername, parentId: parentUsername },
        '',
        '',
        session
      );

      await session.commitTransaction();
      session.endSession();

      // Return user details including JWT token
      const token = TokenService.generateToken(newUser._id);
      return {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        sponsorId: newUser.sponsorId,
        parentId: newUser.parentId,
        position: newUser.position,
        status: newUser.status,
        isAdmin: newUser.isAdmin,
        token
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async login(loginId, password, ipAddress = '', userAgent = '') {
    const term = loginId.trim();
    
    // Find user by username, email or mobile
    const user = await UserRepository.findOne({
      $or: [
        { username: term.toUpperCase() },
        { email: term.toLowerCase() },
        { mobile: term }
      ]
    });

    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid login credentials');
    }

    if (user.status === 'blocked') {
      throw new Error('Account suspended. Please contact administrator.');
    }

    // Log login audit
    await AuditLogRepository.log(user._id, 'LOGIN', { username: user.username }, ipAddress, userAgent);

    const token = TokenService.generateToken(user._id);

    return {
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
      token
    };
  }

  async verifySponsor(sponsorId) {
    const term = sponsorId.trim().toUpperCase();
    const user = await UserRepository.findOne({ username: term });
    if (!user) {
      throw new Error('Sponsor ID not found');
    }
    return { name: user.name, username: user.username };
  }

  async verifyParent(parentId, position) {
    const term = parentId.trim().toUpperCase();
    const parent = await UserRepository.findOne({ username: term });
    if (!parent) {
      throw new Error('Parent ID not found');
    }

    const occupied = await UserRepository.findOne({ parent: parent._id, position });
    if (occupied) {
      throw new Error(`Position ${position} is already occupied under ${parent.username}`);
    }

    return { success: true, parentName: parent.name };
  }
}

module.exports = new AuthService();
