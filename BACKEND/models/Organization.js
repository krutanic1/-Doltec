const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['agency', 'builder', 'dealer', 'owner'], default: 'agency', index: true },
  status: { type: String, enum: ['active', 'trial', 'suspended', 'archived'], default: 'active', index: true },
  planCode: { type: String, default: 'starter', index: true },
  billingEmail: { type: String, trim: true, index: true },
  primaryContactName: { type: String, trim: true },
  primaryContactPhone: { type: String, trim: true },
  primaryContactEmail: { type: String, trim: true },
  parentOrganizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  branding: {
    logoUrl: { type: String, default: '' },
    themeColor: { type: String, default: '#2563eb' },
  },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  limits: { type: mongoose.Schema.Types.Mixed, default: {} },
  trialEndsAt: { type: Date, default: null },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deleteReason: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

OrganizationSchema.index({ name: 'text', slug: 'text' });
OrganizationSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Organization', OrganizationSchema);