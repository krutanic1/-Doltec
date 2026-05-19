const mongoose = require('mongoose');
const Property = require('../models/Property');
const User = require('../models/User');
const Lead = require('../models/Lead');
const LeadInteraction = require('../models/LeadInteraction');
const OwnerContactRevealAudit = require('../models/OwnerContactRevealAudit');
const Notification = require('../models/Notification');
const { sendEmail } = require('../controllers/MailController');

/**
 * Main Service for handling Lead Pipeline and Property Owner Details Unlocks.
 */
class LeadUnlockService {
  /**
   * core method to unlock property contact and record/update lead.
   */
  async unlockContact({ propertyId, viewerUserId, viewerName, viewerEmail, viewerPhone, ip, userAgent }) {
    // 1. Fetch and validate property
    const property = await Property.findById(propertyId).populate('poster', 'name email phone role orgId');
    if (!property) {
      const err = new Error('Property not found');
      err.statusCode = 404;
      throw err;
    }

    // Only allow lead capture on verified/active property listings
    const allowedStatuses = ['ACTIVE', 'APPROVED'];
    if (!allowedStatuses.includes(property.status)) {
      const err = new Error('Lead capture is only permitted on verified and active property listings');
      err.statusCode = 400;
      throw err;
    }

    const owner = property.poster;
    if (!owner) {
      const err = new Error('This property has no assigned owner or agent');
      err.statusCode = 400;
      throw err;
    }

    const orgId = property.orgId || owner.orgId || null;

    // 2. Prevent duplicate lead / Update existing lead
    let lead = await Lead.findOne({ propertyId, viewerUserId });
    
    if (lead) {
      // Update existing lead interaction count and timestamp
      lead.interactionCount += 1;
      lead.lastInteractionAt = new Date();
      lead.contactUnlockedAt = new Date();
      lead.viewerName = viewerName;
      lead.viewerEmail = viewerEmail;
      lead.viewerPhone = viewerPhone;
      lead.name = viewerName; // backward compatibility
      lead.email = viewerEmail;
      lead.phone = viewerPhone;
      
      lead.activities.push({
        type: 'interaction',
        message: `Unlocked owner details again. Total interactions: ${lead.interactionCount}`,
        byUser: viewerUserId
      });
      await lead.save();
    } else {
      // Create fresh new lead
      lead = await Lead.create({
        orgId,
        propertyId,
        ownerId: owner._id,
        userId: viewerUserId, // backward compatibility
        viewerUserId,
        viewerName,
        viewerEmail,
        viewerPhone,
        name: viewerName, // backward compatibility
        email: viewerEmail,
        phone: viewerPhone,
        source: 'property_contact_unlock',
        status: 'NEW',
        notes: `Initial unlock from property detail card.`,
        lastInteractionAt: new Date(),
        interactionCount: 1,
        contactUnlockedAt: new Date(),
        activities: [{
          type: 'creation',
          message: 'Lead created via contact unlock flow',
          byUser: viewerUserId
        }]
      });
    }

    // Update Property Leads Count
    try {
      const totalLeadsForProperty = await Lead.countDocuments({ propertyId: property._id, deletedAt: null });
      property.metrics = property.metrics || { views: 0, leads: 0, shortlists: 0 };
      property.metrics.leads = totalLeadsForProperty;
      await property.save();
    } catch (metricErr) {
      console.error('Failed to update property lead metric:', metricErr.message);
    }

    // 3. Create LeadInteraction record
    await LeadInteraction.create({
      orgId,
      leadId: lead._id,
      propertyId,
      viewerUserId,
      action: 'UNLOCK_VIEW',
      ip,
      userAgent
    });

    // 4. Create OwnerContactRevealAudit record
    await OwnerContactRevealAudit.create({
      orgId,
      propertyId,
      ownerId: owner._id,
      viewerUserId,
      viewerName,
      viewerEmail,
      viewerPhone,
      unlockedAt: new Date(),
      ipAddress: ip,
      userAgent
    });

    // 5. Send In-App notification to Owner
    try {
      await Notification.create({
        orgId: orgId || new mongoose.Types.ObjectId(), // fallbacks in case orgId is null
        recipientUserId: owner._id,
        type: 'LEAD_UNLOCKED',
        title: 'New Lead Unlocked Contact Details',
        body: `${viewerName} unlocked contact details for your property: "${property.title}"`,
        payload: { leadId: lead._id, propertyId: property._id },
        status: 'queued',
        channel: 'in_app',
        priority: 'high',
        entityType: 'Lead',
        entityId: lead._id
      });
    } catch (notifErr) {
      console.error('Failed to create in-app notification:', notifErr.message);
    }

    // 6. Send Email notification to Owner (Non-blocking)
    const propertyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/properties/${property.slug}`;
    const ownerEmailContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">New Lead Captured!</h2>
        <p>A buyer has unlocked contact details for your listing:</p>
        <p><strong>Property:</strong> <a href="${propertyLink}">${property.title}</a></p>
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Lead Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td><td>${viewerName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${viewerPhone}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${viewerEmail}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Unlocked At:</td><td>${new Date().toLocaleString()}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Total Views:</td><td>${lead.interactionCount}</td></tr>
        </table>
        <p style="margin-top: 20px;">Log in to your dashboard to manage this lead in your Lead Pipeline.</p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">This is an automated notification from Doltec Real Estate.</p>
      </div>
    `;

    try {
      if (owner.email) {
        await sendEmail({
          email: owner.email,
          subject: `[Doltec] Contact Unlocked for "${property.title}" by ${viewerName}`,
          message: ownerEmailContent
        });
      }
    } catch (emailErr) {
      console.error('Failed to send owner notification email:', emailErr.message);
    }

    // 7. Send Acknowledgement Email to Viewer (Non-blocking)
    const viewerEmailContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Thank you for your interest!</h2>
        <p>You have unlocked the owner details for the property: <strong>${property.title}</strong>.</p>
        <p>The owner/agent has been notified and will get in touch with you shortly.</p>
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Listing Contact Summary</h3>
        <p><strong>Owner Name:</strong> ${owner.name}</p>
        <p><strong>Owner Phone:</strong> ${owner.phone || 'Unavailable'}</p>
        <p><strong>Owner Email:</strong> ${owner.email}</p>
        <p style="margin-top: 20px;"><a href="${propertyLink}" style="background-color: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View Listing Again</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">Thank you for using Doltec Real Estate.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: viewerEmail,
        subject: `[Doltec] Owner details unlocked for "${property.title}"`,
        message: viewerEmailContent
      });
    } catch (emailErr) {
      console.error('Failed to send viewer acknowledgement email:', emailErr.message);
    }

    // 8. Return owner contact details revealed inline
    return {
      unlocked: true,
      leadId: lead._id,
      owner: {
        name: owner.name,
        email: owner.email,
        phone: owner.phone || 'Not Shared',
        role: owner.role
      }
    };
  }
}

module.exports = new LeadUnlockService();
