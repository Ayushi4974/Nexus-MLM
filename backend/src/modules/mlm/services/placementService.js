const UserRepository = require('../../../repositories/UserRepository');

class PlacementService {
  async findPlacementBFS(sponsorObjId, session = null) {
    const queue = [sponsorObjId];

    while (queue.length > 0) {
      const currentId = queue.shift();

      // Check left position
      const leftChild = await UserRepository.findOne(
        { parent: currentId, position: 'left' },
        '',
        '_id',
        session
      );
      if (!leftChild) {
        return { parentObjId: currentId, position: 'left' };
      }

      // Check right position
      const rightChild = await UserRepository.findOne(
        { parent: currentId, position: 'right' },
        '',
        '_id',
        session
      );
      if (!rightChild) {
        return { parentObjId: currentId, position: 'right' };
      }

      // If both positions are occupied, enqueue them to check next level down
      queue.push(leftChild._id);
      queue.push(rightChild._id);
    }

    throw new Error('Failed to find placement vacancy in tree');
  }

  async updateAncestorsCount(parentObjId, position, session = null) {
    let currentParentId = parentObjId;
    let currentPosition = position;

    while (currentParentId) {
      const parentNode = await UserRepository.findById(currentParentId, '', '', session);
      if (!parentNode) break;

      if (currentPosition === 'left') {
        parentNode.leftCount += 1;
      } else if (currentPosition === 'right') {
        parentNode.rightCount += 1;
      }

      await parentNode.save({ session });

      // Move up: set parent's parent and parent's position relative to its parent
      currentPosition = parentNode.position;
      currentParentId = parentNode.parent;
    }
  }
}

module.exports = new PlacementService();
