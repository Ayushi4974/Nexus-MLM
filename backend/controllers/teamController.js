const { User } = require('../models');

// @desc    Get direct team members
// @route   GET /api/team/direct
// @access  Private
const getDirectTeam = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = { sponsor: req.user._id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('activePackage', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Recursive helper to build genealogy binary tree structure
const buildGenealogyTree = async (userNode, currentDepth, maxDepth) => {
  if (!userNode || currentDepth > maxDepth) return null;

  // Fetch left and right child nodes
  const leftChild = await User.findOne({ parent: userNode._id, position: 'left' }).populate('activePackage');
  const rightChild = await User.findOne({ parent: userNode._id, position: 'right' }).populate('activePackage');

  return {
    _id: userNode._id,
    username: userNode.username,
    name: userNode.name,
    status: userNode.status,
    rank: userNode.rank,
    leftCount: userNode.leftCount,
    rightCount: userNode.rightCount,
    leftBV: userNode.leftBV,
    rightBV: userNode.rightBV,
    position: userNode.position,
    activePackage: userNode.activePackage ? userNode.activePackage.name : 'None',
    left: leftChild 
      ? await buildGenealogyTree(leftChild, currentDepth + 1, maxDepth) 
      : { vacant: true, position: 'left', parentId: userNode.username },
    right: rightChild 
      ? await buildGenealogyTree(rightChild, currentDepth + 1, maxDepth) 
      : { vacant: true, position: 'right', parentId: userNode.username },
  };
};

// @desc    Get binary genealogy tree
// @route   GET /api/team/genealogy
// @access  Private
const getGenealogyTree = async (req, res) => {
  try {
    const searchUsername = req.query.username;
    let rootUser;

    if (searchUsername) {
      // Find the user requested
      rootUser = await User.findOne({ username: searchUsername }).populate('activePackage');
      if (!rootUser) {
        return res.status(404).json({ success: false, message: 'User username not found' });
      }

      // Security check: Make sure this user is within the logged-in user's downline structure.
      // To keep it simple, we can allow any downline user. For general navigation,
      // we'll traverse up from searchUsername. If we cannot reach logged-in user, we reject access,
      // EXCEPT if the logged-in user searches for themselves or is root user.
      let isDownline = false;
      let checkUser = rootUser;
      
      while (checkUser) {
        if (checkUser._id.toString() === req.user._id.toString()) {
          isDownline = true;
          break;
        }
        if (!checkUser.parent) break;
        checkUser = await User.findById(checkUser.parent);
      }

      if (!isDownline) {
        return res.status(403).json({ success: false, message: 'Access Denied: User is not in your downline' });
      }
    } else {
      // Default to logged-in user
      rootUser = await User.findById(req.user._id).populate('activePackage');
    }

    const tree = await buildGenealogyTree(rootUser, 1, 3); // Fetch 3 levels depth: root, level 1, level 2

    res.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDirectTeam,
  getGenealogyTree,
};
