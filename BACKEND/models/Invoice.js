const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', default: null, index: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null, index: true },
  lineItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0, index: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['draft', 'issued', 'paid', 'void', 'overdue'], default: 'draft', index: true },
  issuedAt: { type: Date, default: null, index: true },
  dueAt: { type: Date, default: null, index: true },
  paidAt: { type: Date, default: null },
  pdfUrl: { type: String, default: '' },
  billingSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  voidedAt: { type: Date, default: null, index: true },
  voidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  voidReason: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

InvoiceSchema.index({ orgId: 1, status: 1, issuedAt: -1 });

module.exports = mongoose.model('Invoice', InvoiceSchema);