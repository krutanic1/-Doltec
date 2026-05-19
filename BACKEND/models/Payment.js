const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null, index: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null, index: true },
  provider: { type: String, default: 'razorpay', index: true },
  providerOrderId: { type: String, unique: true, sparse: true, index: true },
  providerPaymentId: { type: String, unique: true, sparse: true, index: true },
  amount: { type: Number, required: true, index: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, default: '' },
  status: { type: String, enum: ['created', 'authorized', 'captured', 'failed', 'refunded', 'reversed'], default: 'created', index: true },
  capturedAt: { type: Date, default: null, index: true },
  refundedAt: { type: Date, default: null },
  failureReason: { type: String, default: '' },
  rawPayloadRef: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

PaymentSchema.index({ orgId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);