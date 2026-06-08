const BaseRepository = require('./BaseRepository');
const Package = require('../modules/packages/models/Package');

class PackageRepository extends BaseRepository {
  constructor() {
    super(Package);
  }

  async findByName(name, session = null) {
    return await this.findOne({ name }, '', '', session);
  }
}

module.exports = new PackageRepository();
