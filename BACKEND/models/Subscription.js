const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  planCode: { type: String, required: true, index: true },
  planName: { type: String, required: true },
  status: { type: String, enum: ['trial', 'active', 'past_due', 'cancelled', 'expired', 'suspended'], default: 'trial', index: true },
  provider: { type: String, default: 'razorpay', index: true },
  providerSubscriptionId: { type: String, unique: true, sparse: true, index: true },
  currentPeriodStart: { type: Date, default: null, index: true },
  currentPeriodEnd: { type: Date, default: null, index: true },
  autoRenew: { type: Boolean, default: true },
  seatCount: { type: Number, default: 1 },
  limitsSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  trialEndsAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null, index: true },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

SubscriptionSchema.index({ orgId: 1, status: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);