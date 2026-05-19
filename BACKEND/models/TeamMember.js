const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  inviteStatus: { type: String, enum: ['invited', 'active', 'revoked', 'pending'], default: 'invited', index: true },
  seatStatus: { type: String, enum: ['occupied', 'available', 'locked'], default: 'occupied', index: true },
  permissionsOverride: { type: [String], default: [] },
  joinedAt: { type: Date, default: null },
  invitedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  revokedAt: { type: Date, default: null, index: true },
  revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  notes: { type: String, default: '' },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

TeamMemberSchema.index({ orgId: 1, userId: 1 }, { unique: true });
TeamMemberSchema.index({ orgId: 1, inviteStatus: 1 });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);