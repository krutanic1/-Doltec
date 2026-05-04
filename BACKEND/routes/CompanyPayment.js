const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Company = require('../models/CompanyUser');
const { razorpay } = require('../middleware/razorpaysetup');
require('dotenv').config();

const plans = {
  '1month': { planId: 'plan_RMdYBgdhoREJhE', amount: 2499, cycles: 1, accessLevel: 'basic', jobPostLimit: null },
  '3months': { planId: 'plan_RNjyuyJ1Oz47c7', amount: 6490, cycles: 3, accessLevel: 'standard', jobPostLimit: null },
  '6months': { planId: 'plan_RNk0Fl8E4odPDH', amount: 11890, cycles: 6, accessLevel: 'premium', jobPostLimit: null },
  '12months': { planId: 'plan_RNk0wEScQ9JVvk', amount: 21890, cycles: 12, accessLevel: 'elite', jobPostLimit: null },
};

router.post('/company/payment/create-subscription', async (req, res) => {
  try {
    const { planType, companyId } = req.body;
    if (!companyId || !planType) {
      return res.status(400).json({ success: false, message: 'companyId and planType required' });
    }
    if (!plans[planType]) {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }
    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    const { planId, cycles } = plans[planType];
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      notes: { companyId },
      total_count: cycles,
    });
    res.status(200).json({
      success: true,
      key_id: process.env.RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/company/payment/verify-subscription', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, companyId } = req.body;
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature || !companyId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    console.log('Verifying subscription for companyId:', companyId);
    const body = razorpay_payment_id + '|' + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expectedSignature !== razorpay_signature) {
      console.error('Invalid signature for companyId:', companyId);
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
    console.log('Subscription data:', JSON.stringify(subscription, null, 2));
    const planType = Object.keys(plans).find(
      key => plans[key].planId === subscription.plan_id
    );
    if (!planType) {
      console.error('Invalid plan_id:', subscription.plan_id);
      return res.status(400).json({ success: false, message: 'Invalid subscription type' });
    }
    const currentEnd = subscription.current_end;
    console.log(`Subscription current_end: ${currentEnd} for planType: ${planType}`);
    const subscriptionEnd = currentEnd && currentEnd > 0
      ? new Date(currentEnd * 1000)
      : new Date(Date.now() + plans[planType].cycles * 30 * 24 * 60 * 60 * 1000);
    const company = await Company.findOneAndUpdate(
      { companyId },
      {
        subscriptionPlan: planType,
        accessLevel: plans[planType].accessLevel,
        subscriptionEnd,
        jobPostLimit: plans[planType].jobPostLimit,
      },
      { new: true }
    );
    if (!company) {
      console.error('Company not found for companyId:', companyId);
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    console.log(`Subscription verified and company ${companyId} updated to ${planType}, end: ${subscriptionEnd.toLocaleString()}`);
    res.status(200).json({
      success: true,
      company: {
        companyId: company.companyId,
        companyName: company.companyName,
        email: company.email,
        subscriptionPlan: company.subscriptionPlan,
        accessLevel: company.accessLevel,
        subscriptionEnd: company.subscriptionEnd,
        jobPostLimit: company.jobPostLimit,
      },
    });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;