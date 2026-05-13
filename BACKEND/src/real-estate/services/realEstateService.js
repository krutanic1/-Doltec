const RealEstate = require('../../models/RealEstate');

async function listProperties({ page = 1, limit = 12, filters = {} } = {}) {
  const skip = Math.max(0, (Number(page) - 1) * Number(limit));
  const q = { ...filters };
  const query = RealEstate.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const data = await query.exec();
  const totalCount = await RealEstate.countDocuments(q);
  return { data, totalCount };
}

async function getPropertyById(id) {
  return RealEstate.findById(id).exec();
}

module.exports = {
  listProperties,
  getPropertyById,
};
