const FeaturedBooking = require('../models/FeaturedBooking');
const Property = require('../models/Property');

const User = require('../models/User');

const FEATURE_DURATION_DAYS = 30;

const isAdminUser = (req) => {
  const role = String(req?.user?.role || req?.user?.posterType || req?.role || req?.workspaceRole || '').toUpperCase();
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
};

exports.getFeaturedBookings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.sub;
    const user = await User.findById(userId);
    const orgId = user?.orgId || null;
    const { status, slotType } = req.query;

    const query = {};

    if (!isAdminUser(req)) {
      // Users can see their own bookings if not in an org
      Object.assign(query, orgId ? { orgId } : { createdBy: userId });
    }

    if (status) {
      query.status = status;
    }

    if (slotType) {
      query.slotType = slotType;
    }

    const bookings = await FeaturedBooking.find(query)
      .sort({ createdAt: -1 })
      .populate('propertyId', 'title category locality city media price pricing tier status metrics')
      .populate('createdBy', 'name email role')
      .populate('bookedByUserId', 'name email role');
    
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFeaturedBooking = async (req, res) => {
  try {
    const { propertyId, placement } = req.body;
    const userId = req.user.id || req.user._id || req.user.sub;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    const orgId = user.orgId || null;

    // If orgId exists, it must belong to their org. Else, it must be created by them.
    const query = orgId ? { _id: propertyId, orgId } : { _id: propertyId, poster: userId };
    const property = await Property.findOne(query);
    
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized.' });
    }

    // Check if property already has a pending or active feature request
    const activeBooking = await FeaturedBooking.findOne({
        propertyId,
        status: { $in: ['pending', 'booked', 'active'] },
        endAt: { $gt: new Date() }
    });

    if (activeBooking) {
        return res.status(400).json({ success: false, message: 'Property already has a pending or active feature request.' });
    }

    const startAt = new Date();
    const endAt = new Date();
    endAt.setDate(endAt.getDate() + FEATURE_DURATION_DAYS);

    const booking = await FeaturedBooking.create({
      orgId,
      propertyId,
      startAt,
      endAt,
      placement: placement || 'homepage',
      status: 'pending',
      bookedByUserId: userId,
      createdBy: userId,
      updatedBy: userId,
    });

    res.status(201).json({ success: true, message: 'Feature request submitted for approval.', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveFeaturedBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.id || req.user._id || req.user.sub;
    const booking = await FeaturedBooking.findById(id).populate('propertyId');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Feature request not found.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending feature requests can be approved.' });
    }

    const startAt = new Date();
    const endAt = new Date();
    endAt.setDate(endAt.getDate() + FEATURE_DURATION_DAYS);

    booking.status = 'active';
    booking.startAt = startAt;
    booking.endAt = endAt;
    booking.approvedBy = adminUserId;
    booking.approvedAt = new Date();
    booking.updatedBy = adminUserId;
    booking.reviewNote = 'Approved by admin';
    await booking.save();

    if (booking.propertyId && booking.propertyId.tier !== 'PREMIUM') {
      booking.propertyId.tier = 'PREMIUM';
      await booking.propertyId.save();
    }

    const populated = await FeaturedBooking.findById(id).populate('propertyId', 'title category locality city media price pricing tier status metrics');

    res.status(200).json({ success: true, message: 'Feature request approved.', booking: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectFeaturedBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewNote = 'Rejected by admin' } = req.body;
    const adminUserId = req.user.id || req.user._id || req.user.sub;
    const booking = await FeaturedBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Feature request not found.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending feature requests can be rejected.' });
    }

    booking.status = 'rejected';
    booking.updatedBy = adminUserId;
    booking.reviewNote = reviewNote;
    booking.cancelledAt = new Date();
    booking.cancelledBy = adminUserId;
    await booking.save();

    const populated = await FeaturedBooking.findById(id).populate('propertyId', 'title category locality city media price pricing tier status metrics');

    res.status(200).json({ success: true, message: 'Feature request rejected.', booking: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
