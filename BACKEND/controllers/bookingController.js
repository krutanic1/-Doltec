const FeaturedBooking = require('../models/FeaturedBooking');
const Property = require('../models/Property');

const User = require('../models/User');

exports.getFeaturedBookings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.sub;
    const user = await User.findById(userId);
    const orgId = user?.orgId || null;

    // Users can see their own bookings if not in an org
    const query = orgId ? { orgId } : { createdBy: userId };
    
    const bookings = await FeaturedBooking.find(query).populate('propertyId', 'title category locality city media price pricing tier status metrics');
    
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

    // Check if property is already featured and active
    const activeBooking = await FeaturedBooking.findOne({ 
        propertyId, 
        status: { $in: ['booked', 'active'] },
        endAt: { $gt: new Date() }
    });

    if (activeBooking) {
        return res.status(400).json({ success: false, message: 'Property is already featured.' });
    }

    const startAt = new Date();
    const endAt = new Date();
    endAt.setDate(endAt.getDate() + 30); // 30 days featured slot

    const booking = await FeaturedBooking.create({
      orgId,
      propertyId,
      startAt,
      endAt,
      placement: placement || 'homepage',
      status: 'active',
      bookedByUserId: userId,
      createdBy: userId
    });

    // Also upgrade the tier on the property to PREMIUM if not already
    if (property.tier !== 'PREMIUM') {
        property.tier = 'PREMIUM';
        await property.save();
    }

    res.status(201).json({ success: true, message: 'Featured slot booked successfully.', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
