const mongoose = require('mongoose');

const PropertyPackageSchema = new mongoose.Schema({
  scope: { type: String, enum: ['global', 'organization'], default: 'global', index: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  code: { type: String, required: true, index: true },
  name: { type: String, required: true },
  tier: { type: String, enum: ['Starter', 'Boost', 'Elite', 'Prime'], required: true, index: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0, index: true },
  currency: { type: String, default: 'INR' },
  durationDays: { type: Number, default: 30, index: true },
  featuredSlots: { type: Number, default: 0 },
  leadCredits: { type: Number, default: 0 },
  campaignCredits: { type: Number, default: 0 },
  limits: { type: mongoose.Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true, index: true },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

PropertyPackageSchema.index({ scope: 1, code: 1 }, { unique: true });
PropertyPackageSchema.index({ orgId: 1, code: 1 }, { unique: false });

module.exports = mongoose.model('PropertyPackage', PropertyPackageSchema);