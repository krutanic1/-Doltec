const authService = require('../services/authService');
const leadUnlockService = require('../services/leadUnlockService');
const User = require('../models/User');
const Property = require('../models/Property');
const Lead = require('../models/Lead');

/**
 * Controller for Lead Capture and Owner Contact Details Unlock flow.
 */
class LeadUnlockController {
  
  /**
   * Helper to extract user ID from req.user (supports 'sub' or 'id')
   */
  getUserId(req) {
    if (!req.user) return null;
    return req.user.sub || req.user.id || req.user._id || null;
  }

  /**
   * Register user and unlock owner details
   * POST /api/v1/auth/register-and-unlock
   */
  async registerAndUnlock(req, res) {
    try {
      const { name, email, phone, password, propertyId } = req.body;
      
      if (!name || !email || !password || !propertyId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name, email, password and propertyId are required' 
        });
      }

      // 1. Register the new user
      const user = await authService.register({ 
        name, 
        email, 
        phone, 
        password, 
        role: 'USER' 
      });

      // 2. Issue JWT tokens
      const { accessToken, refreshToken } = await authService.issueTokenPair(user, {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      });

      // 3. Unlock owner details & log lead
      const unlockResult = await leadUnlockService.unlockContact({
        propertyId,
        viewerUserId: user._id,
        viewerName: user.name,
        viewerEmail: user.email,
        viewerPhone: user.phone || phone || 'Not Shared',
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(201).json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        unlockedData: unlockResult
      });

    } catch (err) {
      console.error('Error in registerAndUnlock:', err);
      if (err.code === 11000) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email or phone number is already registered' 
        });
      }
      return res.status(err.statusCode || 500).json({ 
        success: false, 
        message: err.message || 'Server error during registration' 
      });
    }
  }

  /**
   * Login user and unlock owner details
   * POST /api/v1/auth/login-and-unlock
   */
  async loginAndUnlock(req, res) {
    try {
      const { email, password, propertyId } = req.body;

      if (!email || !password || !propertyId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email, password and propertyId are required' 
        });
      }

      // 1. Authenticate user
      const loginResult = await authService.login({ email, password });
      const { user, accessToken, refreshToken } = loginResult;

      // 2. Unlock owner details & log lead
      const unlockResult = await leadUnlockService.unlockContact({
        propertyId,
        viewerUserId: user._id,
        viewerName: user.name,
        viewerEmail: user.email,
        viewerPhone: user.phone || 'Not Shared',
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(200).json({
        success: true,
        token: accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        unlockedData: unlockResult
      });

    } catch (err) {
      console.error('Error in loginAndUnlock:', err);
      return res.status(err.statusCode || 500).json({ 
        success: false, 
        message: err.message || 'Invalid email or password' 
      });
    }
  }

  /**
   * Directly unlock contact if already logged in
   * POST /api/v1/properties/:propertyId/unlock-contact
   */
  async unlockContact(req, res) {
    try {
      const { propertyId } = req.params;
      const viewerId = req.user.sub || req.user.id || req.user._id;
      
      if (!viewerId) {
        return res.status(401).json({ success: false, message: 'Unauthorized. User context missing.' });
      }

      // Fetch fresh details of the viewer
      const user = await User.findById(viewerId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const unlockResult = await leadUnlockService.unlockContact({
        propertyId,
        viewerUserId: user._id,
        viewerName: user.name,
        viewerEmail: user.email,
        viewerPhone: user.phone || 'Not Shared',
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(200).json({
        success: true,
        unlockedData: unlockResult
      });

    } catch (err) {
      console.error('Error in unlockContact:', err);
      return res.status(err.statusCode || 500).json({ 
        success: false, 
        message: err.message || 'Server error during contact unlock' 
      });
    }
  }

  /**
   * All leads for logged-in owner/agent
   * GET /api/v1/owner/leads
   */
  async getOwnerLeads(req, res) {
    try {
      const ownerId = req.user.sub || req.user.id || req.user._id;
      const userRole = req.user.role;

      // Filtering criteria
      const query = { deletedAt: null };
      
      // If not Admin, restrict to owner's leads
      if (userRole !== 'ADMIN') {
        query.ownerId = ownerId;
      }

      // Optional status filters
      if (req.query.status) {
        query.status = req.query.status;
      }
      
      // Optional property filters
      if (req.query.propertyId) {
        query.propertyId = req.query.propertyId;
      }

      // Search functionality (by viewerName, email, phone)
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query.$or = [
          { viewerName: searchRegex },
          { viewerEmail: searchRegex },
          { viewerPhone: searchRegex }
        ];
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const leads = await Lead.find(query)
        .populate('propertyId', 'title slug city locality pricing category price')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Lead.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (err) {
      console.error('Error in getOwnerLeads:', err);
      return res.status(500).json({ success: false, message: 'Server error fetching leads' });
    }
  }

  /**
   * Get single lead by ID
   * GET /api/v1/owner/leads/:leadId
   */
  async getOwnerLeadById(req, res) {
    try {
      const { leadId } = req.params;
      const ownerId = req.user.sub || req.user.id || req.user._id;
      const userRole = req.user.role;

      const lead = await Lead.findById(leadId)
        .populate('propertyId', 'title slug city locality pricing category features media price')
        .populate('viewerUserId', 'name email phone role');

      if (!lead || lead.deletedAt) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      // Check access permission (owner or admin)
      if (userRole !== 'ADMIN' && String(lead.ownerId) !== String(ownerId)) {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not own this lead.' });
      }

      return res.status(200).json({
        success: true,
        data: lead
      });

    } catch (err) {
      console.error('Error in getOwnerLeadById:', err);
      return res.status(500).json({ success: false, message: 'Server error fetching lead details' });
    }
  }

  /**
   * Update lead status
   * PATCH /api/v1/owner/leads/:leadId/status
   */
  async updateLeadStatus(req, res) {
    try {
      const { leadId } = req.params;
      const { status, notes } = req.body;
      const ownerId = req.user.sub || req.user.id || req.user._id;
      const userRole = req.user.role;

      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      const lead = await Lead.findById(leadId);
      if (!lead || lead.deletedAt) {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }

      // Check permission (owner or admin)
      if (userRole !== 'ADMIN' && String(lead.ownerId) !== String(ownerId)) {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not own this lead.' });
      }

      const oldStatus = lead.status;
      lead.status = status;
      if (notes) {
        lead.notes = notes;
      }
      
      lead.stageHistory = lead.stageHistory || [];
      lead.stageHistory.push({
        from: oldStatus,
        to: status,
        byUser: ownerId,
        at: new Date()
      });

      lead.activities = lead.activities || [];
      lead.activities.push({
        type: 'status_change',
        message: `Status updated from ${oldStatus} to ${status}. Notes: ${notes || 'None'}`,
        byUser: ownerId
      });

      await lead.save();

      return res.status(200).json({
        success: true,
        message: 'Lead status updated successfully',
        data: lead
      });

    } catch (err) {
      console.error('Error in updateLeadStatus:', err);
      return res.status(500).json({ success: false, message: 'Server error updating lead status' });
    }
  }

  /**
   * Property-specific lead listing
   * GET /api/v1/owner/properties/:propertyId/leads
   */
  async getPropertyLeads(req, res) {
    try {
      const { propertyId } = req.params;
      const ownerId = req.user.sub || req.user.id || req.user._id;
      const userRole = req.user.role;

      // Verify property belongs to the owner
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }

      if (userRole !== 'ADMIN' && String(property.poster) !== String(ownerId)) {
        return res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
      }

      const leads = await Lead.find({ propertyId, deletedAt: null })
        .populate('viewerUserId', 'name email phone')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: leads
      });

    } catch (err) {
      console.error('Error in getPropertyLeads:', err);
      return res.status(500).json({ success: false, message: 'Server error fetching property leads' });
    }
  }

  /**
   * Get stats summary for dashboard
   * GET /api/v1/owner/leads/stats/summary
   */
  async getLeadsStatsSummary(req, res) {
    try {
      const ownerId = req.user.sub || req.user.id || req.user._id;
      const userRole = req.user.role;

      const query = { deletedAt: null };
      if (userRole !== 'ADMIN') {
        query.ownerId = ownerId;
      }

      const totalLeads = await Lead.countDocuments(query);
      
      // Calculate breakdown by status
      const agg = await Lead.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const statusBreakdown = {
        NEW: 0,
        CONTACT_VIEWED: 0,
        ATTEMPTED_CALL: 0,
        CONTACTED: 0,
        FOLLOW_UP: 0,
        QUALIFIED: 0,
        SITE_VISIT: 0,
        NEGOTIATION: 0,
        CLOSED: 0,
        LOST: 0
      };

      let activeLeads = 0;
      let closedLeads = 0;

      agg.forEach(item => {
        const normalized = String(item._id).toUpperCase();
        if (statusBreakdown[normalized] !== undefined) {
          statusBreakdown[normalized] = item.count;
        } else {
          // support legacy lowercase values if any
          const lower = String(item._id).toLowerCase();
          if (lower === 'new') statusBreakdown.NEW += item.count;
          else if (lower === 'contacted') statusBreakdown.CONTACTED += item.count;
          else if (lower === 'closed') statusBreakdown.CLOSED += item.count;
        }
      });

      // Sum active vs closed/lost
      Object.keys(statusBreakdown).forEach(key => {
        if (['CLOSED', 'LOST'].includes(key)) {
          closedLeads += statusBreakdown[key];
        } else {
          activeLeads += statusBreakdown[key];
        }
      });

      // Fetch top performing properties based on leads count
      const topPropertiesAgg = await Lead.aggregate([
        { $match: query },
        { $group: { _id: '$propertyId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      const topProperties = await Property.populate(topPropertiesAgg, {
        path: '_id',
        select: 'title slug city pricing price'
      });

      return res.status(200).json({
        success: true,
        data: {
          totalLeads,
          activeLeads,
          closedLeads,
          statusBreakdown,
          topProperties: topProperties.map(p => ({
            property: p._id,
            leadCount: p.count
          }))
        }
      });

    } catch (err) {
      console.error('Error in getLeadsStatsSummary:', err);
      return res.status(500).json({ success: false, message: 'Server error generating leads stats' });
    }
  }
}

module.exports = new LeadUnlockController();
