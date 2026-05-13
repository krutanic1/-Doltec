   const Lead = require('../models/Lead');
const Property = require('../models/Property');

exports.create = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    console.log('Enquiry for property:', propertyId);

    if (!propertyId || !name || !phone) {
      return res.status(400).json({ success: false, message: 'Property, Name and Phone are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const lead = await Lead.create({
      propertyId,
      userId: req.user?.id || null,
      name,
      email,
      phone,
      message,
      status: 'new'
    });

    res.status(201).json({ success: true, message: 'Enquiry sent successfully', data: lead });
  } catch (error) {
    console.error('Lead Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'ADMIN') {
      // Find properties owned by this user
      const ownedProperties = await Property.find({ poster: req.user.id }).select('_id');
      const ids = ownedProperties.map(p => p._id);
      filter.propertyId = { $in: ids };
    }

    const leads = await Lead.find(filter)
      .populate('propertyId', 'title slug city locality')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // Check permission (Admin or Property Owner)
    if (req.user.role !== 'ADMIN') {
      const property = await Property.findById(lead.propertyId);
      if (!property || String(property.poster) !== String(req.user.id)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    lead.status = status;
    await lead.save();

    return res.status(200).json({ success: true, message: 'Lead status updated', data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
