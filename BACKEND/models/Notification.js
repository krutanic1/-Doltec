const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['queued', 'sent', 'delivered', 'read', 'archived'], default: 'queued', index: true },
  readAt: { type: Date, default: null, index: true },
  deliveredAt: { type: Date, default: null, index: true },
  channel: { type: String, enum: ['in_app', 'push', 'sms', 'email'], default: 'in_app', index: true },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal', index: true },
  entityType: { type: String, default: '', index: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  archivedAt: { type: Date, default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

NotificationSchema.index({ recipientUserId: 1, readAt: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);