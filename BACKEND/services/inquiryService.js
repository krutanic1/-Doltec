const Inquiry = require('../models/Inquiry');
const mongoose = require('mongoose');

async function createInquiry(data) {
  const doc = new Inquiry(data);
  return doc.save();
}

async function getInquiryById(id, { orgId } = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const query = { _id: id, deletedAt: null };
  if (orgId) query.orgId = orgId;
  return Inquiry.findOne(query)
    .populate('property')
    .populate('assignedTo', 'name email')
    .populate('sender.user', 'name email');
}

async function listInquiries({ filter = {}, page = 1, limit = 20, sort = { createdAt: -1 }, search, orgId } = {}) {
  const q = { deletedAt: null };
  if (orgId) q.orgId = orgId;
  if (filter.status) q.status = filter.status;
  if (filter.assignedTo) q.assignedTo = filter.assignedTo;
  if (search) {
    q.$or = [
      { 'sender.name': { $regex: search, $options: 'i' } },
      { 'sender.email': { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Math.max(1, page) - 1) * limit;
  const [items, total] = await Promise.all([
    Inquiry.find(q).sort(sort).skip(skip).limit(limit).populate('assignedTo', 'name email'),
    Inquiry.countDocuments(q),
  ]);
  return { items, total, page, limit };
}

async function updateInquiry(id, updates = {}, { orgId } = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const query = { _id: id, deletedAt: null };
  if (orgId) query.orgId = orgId;
  return Inquiry.findOneAndUpdate(query, { $set: updates }, { new: true });
}

async function softDeleteInquiry(id, { orgId } = {}) {
  return updateInquiry(id, { deletedAt: new Date() }, { orgId });
}

module.exports = {
  createInquiry,
  getInquiryById,
  listInquiries,
  updateInquiry,
  softDeleteInquiry,
};
