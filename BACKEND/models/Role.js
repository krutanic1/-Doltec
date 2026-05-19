const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  key: { type: String, required: true, index: true },
  name: { type: String, required: true },
  scope: { type: String, enum: ['global', 'organization'], default: 'organization', index: true },
  description: { type: String, default: '' },
  permissionKeys: { type: [String], default: [] },
  isSystem: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

RoleSchema.index({ orgId: 1, key: 1 }, { unique: true });
RoleSchema.index({ orgId: 1, scope: 1 });

module.exports = mongoose.model('Role', RoleSchema);