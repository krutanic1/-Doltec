const mongoose = require('mongoose');

const UpgradeHistorySchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  fromSubscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null, index: true },
  toSubscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null, index: true },
  fromPlanCode: { type: String, default: '', index: true },
  toPlanCode: { type: String, required: true, index: true },
  changedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  reason: { type: String, default: '' },
  deltaAmount: { type: Number, default: 0 },
  effectiveAt: { type: Date, default: Date.now, index: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null, index: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

UpgradeHistorySchema.index({ orgId: 1, effectiveAt: -1 });

module.exports = mongoose.model('UpgradeHistory', UpgradeHistorySchema);