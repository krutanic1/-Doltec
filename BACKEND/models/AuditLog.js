const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuditLogSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetKind: { type: String },
  targetId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed },
  requestId: { type: String, default: '', index: true },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  deletedAt: { type: Date, default: null, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ orgId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
