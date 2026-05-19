const mongoose = require('mongoose');

const CreditTransactionSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  accountType: { type: String, enum: ['featured', 'campaign', 'lead', 'general'], default: 'general', index: true },
  direction: { type: String, enum: ['credit', 'debit'], required: true, index: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true, index: true },
  reason: { type: String, required: true },
  refType: { type: String, default: '', index: true },
  refId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  sourceSubscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null, index: true },
  sourceInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null, index: true },
  expiryAt: { type: Date, default: null, index: true },
  reversalOfTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditTransaction', default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

CreditTransactionSchema.index({ orgId: 1, createdAt: -1 });
CreditTransactionSchema.index({ orgId: 1, accountType: 1, createdAt: -1 });

module.exports = mongoose.model('CreditTransaction', CreditTransactionSchema);