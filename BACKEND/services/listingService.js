const Property = require('../models/Property');
const ListingUpgradeHistory = require('../models/ListingUpgradeHistory');
const User = require('../models/User');
const Organization = require('../models/Organization');
const CreditTransaction = require('../models/CreditTransaction');
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Helper to normalize actors
 */
function normalizeId(actor) {
  const rawId = actor?.id || actor?._id || actor?.sub || null;
  if (rawId && mongoose.Types.ObjectId.isValid(rawId)) {
    return new mongoose.Types.ObjectId(rawId);
  }
  return rawId;
}

/**
 * Builds ownership query depending on user role and orgId
 */
function buildOwnershipFilter(actor, query = {}) {
  const filter = {};
  
  // Handle soft-deleted filter: default is not deleted. If query.deleted === 'true', show only deleted.
  if (query.deleted === 'true') {
    filter.deletedAt = { $ne: null };
  } else {
    filter.deletedAt = null;
  }

  // Admins bypass ownership checks
  if (actor.role === 'ADMIN' || actor.role === 'super_admin') {
    return filter;
  }

  // If user belongs to an organization, they see properties of that organization
  if (actor.orgId) {
    const orgId = actor.orgId;
    if (orgId && mongoose.Types.ObjectId.isValid(orgId)) {
      filter.orgId = new mongoose.Types.ObjectId(orgId);
    } else {
      filter.orgId = orgId;
    }
  } else {
    // Individual agent/owner sees only their posted properties
    filter.poster = normalizeId(actor);
  }

  return filter;
}

/**
 * List all listings with search, pagination, and filters
 */
exports.listListings = async (actor, query = {}) => {
  const ownershipFilter = buildOwnershipFilter(actor, query);
  const filter = { ...ownershipFilter };

  // Search filter
  if (query.search) {
    const searchRegex = new RegExp(String(query.search).trim(), 'i');
    filter.$or = [
      { title: { $regex: searchRegex } },
      { city: { $regex: searchRegex } },
      { locality: { $regex: searchRegex } },
      { description: { $regex: searchRegex } }
    ];
  }

  // Package Tier Filter
  if (query.tier && query.tier !== 'ALL') {
    filter.tier = String(query.tier).toUpperCase();
  }

  // Status Filter
  if (query.status && query.status !== 'all') {
    const statusVal = String(query.status).toUpperCase();
    if (statusVal === 'ACTIVE') {
      // Treat APPROVED and ACTIVE as synonym
      filter.status = { $in: ['APPROVED', 'ACTIVE'] };
    } else {
      filter.status = statusVal;
    }
  }

  // City Filter
  if (query.city) {
    filter.city = { $regex: new RegExp(String(query.city).trim(), 'i') };
  }

  // Category Filter (RESIDENTIAL, COMMERCIAL, etc.)
  if (query.category) {
    filter.category = String(query.category).toUpperCase();
  }

  // Pagination logic
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  // Sorting logic
  let sort = { createdAt: -1 };
  if (query.sortBy) {
    const direction = String(query.sortDirection).toLowerCase() === 'asc' ? 1 : -1;
    if (['createdAt', 'price', 'title', 'status', 'tier'].includes(query.sortBy)) {
      sort = { [query.sortBy]: direction, createdAt: -1 };
    }
  }

  const [listings, totalCount] = await Promise.all([
    Property.find(filter)
      .populate('poster', 'name email phone role')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(filter)
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

/**
 * Get listing by ID with permission checks
 */
exports.getListingById = async (id, actor) => {
  const listing = await Property.findById(id).populate('poster', 'name email phone role').lean();
  if (!listing) {
    throw new AppError('Listing not found', 404, 'NOT_FOUND');
  }

  // Permission validation
  const isAdmin = actor.role === 'ADMIN' || actor.role === 'super_admin';
  const isOwner = String(listing.poster?._id || listing.poster) === String(normalizeId(actor));
  const isOrgMember = actor.orgId && listing.orgId && String(listing.orgId) === String(actor.orgId);

  if (!isAdmin && !isOwner && !isOrgMember) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  return listing;
};

/**
 * Create listing
 */
exports.createListing = async (payload, actor) => {
  const posterId = normalizeId(actor);
  
  // Setup listing fields
  const slug = slugify(payload.title, { lower: true }) + '-' + Date.now();
  const listingData = {
    ...payload,
    poster: posterId,
    slug,
    orgId: actor.orgId || null,
    status: payload.status || 'PENDING',
    tier: payload.tier || 'PLAIN',
    metrics: { views: 0, leads: 0, shortlists: 0 }
  };

  const newListing = new Property(listingData);
  await newListing.save();
  return newListing;
};

/**
 * Update listing
 */
exports.updateListing = async (id, payload, actor) => {
  const listing = await Property.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404, 'NOT_FOUND');
  }

  // Authorization check
  const isAdmin = actor.role === 'ADMIN' || actor.role === 'super_admin';
  const isOwner = String(listing.poster) === String(normalizeId(actor));
  const isOrgMember = actor.orgId && listing.orgId && String(listing.orgId) === String(actor.orgId);

  if (!isAdmin && !isOwner && !isOrgMember) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  // Prevent modifying critical locked fields
  delete payload.poster;
  delete payload.orgId;
  delete payload.tier;
  delete payload.metrics;

  if (payload.title && payload.title !== listing.title) {
    payload.slug = slugify(payload.title, { lower: true }) + '-' + Date.now();
  }

  Object.assign(listing, payload);
  listing.updatedBy = normalizeId(actor);
  listing.updatedAt = Date.now();

  await listing.save();
  return listing;
};

/**
 * Change Listing Status
 */
exports.updateStatus = async (id, status, actor) => {
  const listing = await Property.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404, 'NOT_FOUND');
  }

  // Validate status transition
  const upperStatus = String(status).toUpperCase();
  const allowedStatuses = ['DRAFT', 'PENDING', 'APPROVED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'REJECTED', 'ARCHIVED'];
  if (!allowedStatuses.includes(upperStatus)) {
    throw new AppError('Invalid status value', 400, 'BAD_REQUEST');
  }

  // Authorization check
  const isAdmin = actor.role === 'ADMIN' || actor.role === 'super_admin';
  const isOwner = String(listing.poster) === String(normalizeId(actor));
  const isOrgMember = actor.orgId && listing.orgId && String(listing.orgId) === String(actor.orgId);

  if (!isAdmin && !isOwner && !isOrgMember) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  // Business Rule: Standard users can only pause, archive or active/draft. Moderation states like APPROVED/REJECTED require Admin.
  if (!isAdmin && ['APPROVED', 'REJECTED'].includes(upperStatus)) {
    throw new AppError('Only system moderators can approve or reject listings', 403, 'FORBIDDEN');
  }

  listing.status = upperStatus;
  listing.updatedBy = normalizeId(actor);
  listing.updatedAt = Date.now();

  await listing.save();
  return listing;
};

/**
 * Upgrade Listing Package Tier (with transaction support for credits)
 */
exports.upgradeTier = async (id, targetTier, actor) => {
  const listing = await Property.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404, 'NOT_FOUND');
  }

  const upperTier = String(targetTier).toUpperCase();
  if (!['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'].includes(upperTier)) {
    throw new AppError('Invalid package tier', 400, 'BAD_REQUEST');
  }

  if (listing.tier === upperTier) {
    return listing; // Already at target tier
  }

  // Authorization check
  const isAdmin = actor.role === 'ADMIN' || actor.role === 'super_admin';
  const isOwner = String(listing.poster) === String(normalizeId(actor));
  const isOrgMember = actor.orgId && listing.orgId && String(listing.orgId) === String(actor.orgId);

  if (!isAdmin && !isOwner && !isOrgMember) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let creditsDeducted = 0;

    // Credit Logic: PLAIN is free. Basic, Platinum, and Premium deduct credits.
    const tierCost = {
      PLAIN: 0,
      BASIC: 1,
      PLATINUM: 3,
      PREMIUM: 5
    };

    const cost = tierCost[upperTier] - tierCost[listing.tier];
    
    // Only deduct if upgrading to a higher cost tier
    if (cost > 0 && !isAdmin) {
      if (actor.orgId) {
        // Deduct organization level credits
        const org = await Organization.findById(actor.orgId).session(session);
        if (!org) {
          throw new AppError('Organization not found', 404, 'NOT_FOUND');
        }

        // We check limits.featuredSlots or general credit transaction
        const currentCredits = org.limits?.featuredSlots || 0;
        if (currentCredits < cost) {
          throw new AppError('Insufficient featured slots / package credits inside your organization plan', 402, 'INSUFFICIENT_CREDITS');
        }

        // Deduct and save org limits
        const updatedLimits = { ...org.limits, featuredSlots: currentCredits - cost };
        org.limits = updatedLimits;
        org.markModified('limits');
        await org.save({ session });

        // Record credit transaction
        const lastTx = await CreditTransaction.findOne({ orgId: actor.orgId }).sort({ createdAt: -1 }).session(session);
        const lastBalance = lastTx ? lastTx.balanceAfter : currentCredits;

        const transaction = new CreditTransaction({
          orgId: actor.orgId,
          accountType: 'featured',
          direction: 'debit',
          amount: cost,
          balanceAfter: lastBalance - cost,
          reason: `Listing upgraded to ${upperTier} for listing: ${listing.title}`,
          refType: 'Property',
          refId: listing._id,
          createdBy: normalizeId(actor)
        });
        await transaction.save({ session });
        creditsDeducted = cost;

      } else {
        // Individual User checks
        const user = await User.findById(normalizeId(actor)).session(session);
        // If user has direct job limit or package limits
        const directCredits = user.jobLimit || 0;
        if (directCredits < cost) {
          throw new AppError('Insufficient package credits to upgrade this listing', 402, 'INSUFFICIENT_CREDITS');
        }
        
        user.jobLimit = directCredits - cost;
        await user.save({ session });
        creditsDeducted = cost;
      }
    }

    // Save Upgrade History Log
    const history = new ListingUpgradeHistory({
      propertyId: listing._id,
      orgId: actor.orgId || null,
      userId: normalizeId(actor),
      fromTier: listing.tier,
      toTier: upperTier,
      creditsDeducted,
      reason: `User self-initiated dashboard upgrade to ${upperTier}`
    });
    await history.save({ session });

    // Update Property Tier
    listing.tier = upperTier;
    // Set expiry to 30 days from now for paid tiers
    if (upperTier !== 'PLAIN') {
      listing.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else {
      listing.expiresAt = null;
    }
    
    await listing.save({ session });

    await session.commitTransaction();
    session.endSession();

    return listing;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Soft Delete Listing
 */
exports.softDeleteListing = async (id, actor) => {
  const listing = await Property.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404, 'NOT_FOUND');
  }

  // Authorization check
  const isAdmin = actor.role === 'ADMIN' || actor.role === 'super_admin';
  const isOwner = String(listing.poster) === String(normalizeId(actor));
  const isOrgMember = actor.orgId && listing.orgId && String(listing.orgId) === String(actor.orgId);

  if (!isAdmin && !isOwner && !isOrgMember) {
    throw new AppError('Access denied', 403, 'FORBIDDEN');
  }

  listing.deletedAt = Date.now();
  listing.deletedBy = normalizeId(actor);
  listing.status = 'ARCHIVED'; // Maintain compatibility with both systems

  await listing.save();
  return listing;
};

/**
 * Restore Soft Deleted Listing
 */
exports.restoreListing = async (id, actor) => {
  const listing = await Property.findById(id);
  if (!listing) {
    throw new AppError('Listing not found', 404, 'NOT_FOUND');
  }

  // Authorization check
  const isAdmin = actor.role === 'ADMIN' || actor.role === 'super_admin';
  if (!isAdmin) {
    throw new AppError('Only administrators can restore archived listings', 403, 'FORBIDDEN');
  }

  listing.deletedAt = null;
  listing.deletedBy = null;
  listing.status = 'DRAFT';

  await listing.save();
  return listing;
};

/**
 * Bulk actions
 */
exports.bulkAction = async (ids, action, actor) => {
  const upperAction = String(action).toUpperCase();
  const allowedActions = ['ACTIVATE', 'PAUSE', 'ARCHIVE', 'RESTORE'];
  if (!allowedActions.includes(upperAction)) {
    throw new AppError('Invalid bulk action', 400, 'BAD_REQUEST');
  }

  const results = {
    success: [],
    failed: []
  };

  for (const id of ids) {
    try {
      if (upperAction === 'ACTIVATE') {
        // Map activate to ACTIVE
        await this.updateStatus(id, 'ACTIVE', actor);
      } else if (upperAction === 'PAUSE') {
        await this.updateStatus(id, 'PAUSED', actor);
      } else if (upperAction === 'ARCHIVE') {
        await this.softDeleteListing(id, actor);
      } else if (upperAction === 'RESTORE') {
        await this.restoreListing(id, actor);
      }
      results.success.push(id);
    } catch (err) {
      results.failed.push({ id, reason: err.message });
    }
  }

  return results;
};

/**
 * View Performance Summary / Stats
 */
exports.getStatsSummary = async (actor) => {
  const ownershipFilter = buildOwnershipFilter(actor);
  
  // Calculate aggregate metrics
  const stats = await Property.aggregate([
    { $match: ownershipFilter },
    {
      $group: {
        _id: null,
        totalListings: { $sum: 1 },
        activeListings: {
          $sum: {
            $cond: [
              { $in: ['$status', ['APPROVED', 'ACTIVE']] }, 1, 0
            ]
          }
        },
        draftListings: {
          $sum: { $cond: [{ $eq: ['$status', 'DRAFT'] }, 1, 0] }
        },
        pendingListings: {
          $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
        },
        pausedListings: {
          $sum: { $cond: [{ $eq: ['$status', 'PAUSED'] }, 1, 0] }
        },
        expiredListings: {
          $sum: { $cond: [{ $eq: ['$status', 'EXPIRED'] }, 1, 0] }
        },
        archivedListings: {
          $sum: { $cond: [{ $ne: ['$deletedAt', null] }, 1, 0] }
        },
        totalViews: { $sum: { $ifNull: ['$metrics.views', 0] } },
        totalLeads: { $sum: { $ifNull: ['$metrics.leads', 0] } },
        totalShortlists: { $sum: { $ifNull: ['$metrics.shortlists', 0] } },
        
        // Packages Count
        plainCount: { $sum: { $cond: [{ $eq: ['$tier', 'PLAIN'] }, 1, 0] } },
        basicCount: { $sum: { $cond: [{ $eq: ['$tier', 'BASIC'] }, 1, 0] } },
        platinumCount: { $sum: { $cond: [{ $eq: ['$tier', 'PLATINUM'] }, 1, 0] } },
        premiumCount: { $sum: { $cond: [{ $eq: ['$tier', 'PREMIUM'] }, 1, 0] } }
      }
    }
  ]);

  const defaultStats = {
    totalListings: 0,
    activeListings: 0,
    draftListings: 0,
    pendingListings: 0,
    pausedListings: 0,
    expiredListings: 0,
    archivedListings: 0,
    totalViews: 0,
    totalLeads: 0,
    totalShortlists: 0,
    plainCount: 0,
    basicCount: 0,
    platinumCount: 0,
    premiumCount: 0
  };

  const finalStats = stats.length > 0 ? stats[0] : defaultStats;
  delete finalStats._id;

  // Load Credit details if organization
  let credits = null;
  if (actor.orgId) {
    const org = await Organization.findById(actor.orgId).lean();
    if (org) {
      credits = {
        featuredSlots: org.limits?.featuredSlots || 0,
        planName: org.planCode
      };
    }
  } else {
    const user = await User.findById(normalizeId(actor)).lean();
    credits = {
      featuredSlots: user.jobLimit || 0,
      planName: user.subscriptionPlan
    };
  }

  return {
    summary: finalStats,
    credits
  };
};
