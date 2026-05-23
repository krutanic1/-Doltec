const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  name: { type: String, required: true, index: true },
  type: { type: String, enum: ['organic', 'paid', 'featured', 'retargeting'], default: 'organic', index: true },
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed', 'archived'], default: 'draft', index: true },
  propertyIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Property', default: [] },
  budget: { type: Number, default: 0 },
  channels: { type: [String], default: [] },
  audience: { type: mongoose.Schema.Types.Mixed, default: {} },
  startAt: { type: Date, default: null, index: true },
  endAt: { type: Date, default: null, index: true },
  metricsSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

CampaignSchema.index({ orgId: 1, status: 1, startAt: -1 });

module.exports = mongoose.model('Campaign', CampaignSchema);