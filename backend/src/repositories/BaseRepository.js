class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data, session = null) {
    const docs = await this.model.create([data], { session });
    return docs[0];
  }

  async findById(id, populate = '', select = '', session = null) {
    let query = this.model.findById(id).session(session);
    if (populate) query = query.populate(populate);
    if (select) query = query.select(select);
    return await query.exec();
  }

  async findOne(query, populate = '', select = '', session = null) {
    let q = this.model.findOne(query).session(session);
    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    return await q.exec();
  }

  async find(query = {}, populate = '', select = '', sort = '', limit = null, skip = null, session = null) {
    let q = this.model.find(query).session(session);
    if (populate) q = q.populate(populate);
    if (select) q = q.select(select);
    if (sort) q = q.sort(sort);
    if (skip) q = q.skip(Number(skip));
    if (limit) q = q.limit(Number(limit));
    return await q.exec();
  }

  async updateOne(query, updateData, session = null) {
    return await this.model.updateOne(query, updateData, { session }).exec();
  }

  async updateMany(query, updateData, session = null) {
    return await this.model.updateMany(query, updateData, { session }).exec();
  }

  async findByIdAndUpdate(id, updateData, session = null) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true, session }).exec();
  }

  async deleteOne(query, session = null) {
    return await this.model.deleteOne(query, { session }).exec();
  }

  async deleteMany(query, session = null) {
    return await this.model.deleteMany(query, { session }).exec();
  }

  async countDocuments(query = {}, session = null) {
    return await this.model.countDocuments(query).session(session).exec();
  }
}

module.exports = BaseRepository;
