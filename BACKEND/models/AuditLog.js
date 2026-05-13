const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuditLogSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetKind: { type: String },
  targetId: { type: Schema.Types.ObjectId },
  details: { type: Schema.Types.Mixed }
}, { timestamps: true });

AuditLogSchema.index({ actorId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
