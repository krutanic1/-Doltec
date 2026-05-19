const mongoose = require('mongoose');
const { Schema } = mongoose;

const OwnerContactRevealAuditSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  viewerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  viewerName: { type: String, required: true },
  viewerEmail: { type: String, required: true },
  viewerPhone: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' }
}, { timestamps: true });

OwnerContactRevealAuditSchema.index({ propertyId: 1, viewerUserId: 1 });
OwnerContactRevealAuditSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model('OwnerContactRevealAudit', OwnerContactRevealAuditSchema);
