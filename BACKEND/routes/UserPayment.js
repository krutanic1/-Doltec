const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { razorpay } = require('../middleware/razorpaysetup');
const User = require('../models/User');
require('dotenv').config();

// user creating subscription
router.post('/create-subscription', async (req, res) => {
  const { planType, userId } = req.body;
  try {
    if (!userId || !planType) {
      return res.status(400).json({ error: 'userId and planType are required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Allow repurchase if jobLimit <= 0 or plan expired
    const now = new Date();
    if (user.jobLimit > 2 && user.subscriptionEnd > now) {
      return res.status(400).json({ error: 'Current plan is active with remaining jobs. Use up limits or wait for expiration.' });
    }
    const plans = {
      daily: { amount: 39 },
      gold: { planId: 'plan_RCiFB355nU2nWp', amount: 899 }, 
      premium: { planId: 'plan_NJabc123Premium', amount: 2999 }, 
    };
    if (!plans[planType]) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }
    const { planId, amount } = plans[planType];

    if (planType === 'daily') {
      // Generate a unique receipt within 40 characters
      const shortUserId = userId.substring(0, 8); // First 8 chars of userId
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const receipt = `daily_${shortUserId}_${timestamp}`; // e.g., daily_680b460c_741600 (18 chars)
      const order = await razorpay.orders.create({
        amount: amount * 100, // ₹39 = 3900 paise
        currency: 'INR',
        receipt,
        notes: { userId, planType },
      });
      res.json({
        key_id: process.env.RAZORPAY_KEY_ID,
        order_id: order.id,
        amount,
      });
    } else {
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        notes: { userId, planType },
        total_count: planType === 'gold' ? 6 : 12,
      });
      res.json({
        key_id: process.env.RAZORPAY_KEY_ID,
        subscription_id: subscription.id,
        amount,
      });
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// backend verify subscription
router.post('/verify-subscription', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_subscription_id, razorpay_signature, userId, planType } = req.body;
  try {
    if (!userId || !razorpay_payment_id || (!razorpay_order_id && !razorpay_subscription_id) || !razorpay_signature || !planType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Construct body based on payment type
    let body;
    if (planType === 'daily') {
      body = razorpay_payment_id + '|' + razorpay_order_id; // For orders
      console.log('Verify - Body for signature:', body); // Debug the exact string
    } else {
      body = razorpay_payment_id + '|' + razorpay_subscription_id; // For subscriptions
    }
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    console.log('Verify - Payment ID:', razorpay_payment_id);
    console.log('Verify - Order ID:', razorpay_order_id);
    console.log('Verify - Subscription ID:', razorpay_subscription_id);
    console.log('Verify - Body:', body);
    console.log('Verify - Expected Signature:', expectedSignature);
    console.log('Verify - Received Signature:', razorpay_signature);

    if (expectedSignature === razorpay_signature) {
      const now = new Date();
      let subscriptionEnd = new Date();
      let jobLimit;
      let subscriptionPlan;
      let accessLevel;

      if (planType === 'daily') {
        jobLimit = (user.jobLimit || 2) + 1;
        subscriptionPlan = 'daily';
        accessLevel = 'basic';
        subscriptionEnd.setDate(now.getDate() + 1);
      } else if (planType === 'gold') {
        jobLimit = 30;
        subscriptionPlan = 'gold';
        accessLevel = 'gold';
        subscriptionEnd.setMonth(now.getMonth() + 6);
      } else if (planType === 'premium') {
        jobLimit = -1;
        subscriptionPlan = 'premium';
        accessLevel = 'premium';
        subscriptionEnd.setFullYear(now.getFullYear() + 1);
      } else {
        return res.status(400).json({ error: 'Invalid subscription type' });
      }
      user.jobLimit = jobLimit;
      user.subscriptionPlan = subscriptionPlan;
      user.accessLevel = accessLevel;
      user.paid = true;
      user.subscriptionStart = now;
      user.subscriptionEnd = subscriptionEnd;
      await user.save();

      res.json({ message: 'Subscription verified' });
    } else {
      return res.status(400).json({ error: 'Invalid signature', debug: { expected: expectedSignature, received: razorpay_signature, body: body } });
    }
  } catch (error) {
    console.error('Error verifying subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// get user profile
router.get('/profile', async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    if (user.subscriptionEnd && user.subscriptionEnd < now) {
      user.jobLimit = 2;
      user.subscriptionPlan = 'free';
      user.accessLevel = 'basic';
      user.paid = false;
      user.subscriptionStart = null;
      user.subscriptionEnd = null;
      await user.save();
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      jobLimit: user.jobLimit,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStart: user.subscriptionStart,
      subscriptionEnd: user.subscriptionEnd,
      paid: user.paid,
      accessLevel: user.accessLevel,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;