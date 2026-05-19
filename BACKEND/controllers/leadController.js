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

exports.get = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('propertyId').populate('assignedToUserId', 'name email');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    return res.status(200).json({ success: true, data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.assign = async (req, res) => {
  try {
    const { userId } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // Permission: admin or owner of property
    if (req.user.role !== 'ADMIN') {
      const property = await Property.findById(lead.propertyId);
      if (!property || String(property.poster) !== String(req.user.id)) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
    }

    lead.assignedToUserId = userId;
    lead.activities = lead.activities || [];
    lead.activities.push({ type: 'assignment', message: `Assigned to ${userId}`, byUser: req.user.id });
    await lead.save();
    return res.status(200).json({ success: true, message: 'Lead assigned', data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.pipelineSummary = async (req, res) => {
  try {
    const match = { deletedAt: null };
    if (req.user.role !== 'ADMIN') {
      const owned = await Property.find({ poster: req.user.id }).select('_id');
      match.propertyId = { $in: owned.map(p => p._id) };
    }
    const agg = await Lead.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const summary = agg.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});
    return res.json({ success: true, data: summary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { message } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    lead.activities = lead.activities || [];
    lead.activities.push({ type: 'comment', message, byUser: req.user.id });
    await lead.save();
    return res.json({ success: true, data: lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    lead.deletedAt = new Date();
    lead.deletedBy = req.user.id;
    await lead.save();
    return res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
