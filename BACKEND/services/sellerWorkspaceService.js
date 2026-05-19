const Property = require('../models/Property');
const Lead = require('../models/Lead');
const SavedProperty = require('../models/SavedProperty');
const SavedItem = require('../models/SavedItem');
const AuditLog = require('../models/AuditLog');
const PropertyPackage = require('../models/PropertyPackage');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { normalizeWorkspaceRole, canAccessRole } = require('../utils/workspaceRoles');

const SELLER_MODULES = [
  { key: 'workspace-overview', label: 'Workspace Overview', route: '/real-estate/workspace', roles: ['super_admin', 'agency_owner', 'manager', 'agent', 'support'] },
  { key: 'properties', label: 'Properties', route: '/real-estate/workspace/properties', roles: ['super_admin', 'agency_owner', 'manager', 'agent'] },
  { key: 'listing-packages', label: 'Listing Packages', route: '/real-estate/workspace/listing-packages', roles: ['super_admin', 'agency_owner', 'manager'] },
  { key: 'inquiries-center', label: 'Inquiries Center', route: '/real-estate/workspace/inquiries', roles: ['super_admin', 'agency_owner', 'manager', 'agent', 'support'] },
  { key: 'lead-pipeline', label: 'Lead Pipeline', route: '/real-estate/workspace/leads', roles: ['super_admin', 'agency_owner', 'manager', 'agent', 'support'] },
  { key: 'plan-manager', label: 'Plan Manager', route: '/real-estate/workspace/plans', roles: ['super_admin', 'agency_owner', 'manager'] },
  { key: 'billing-desk', label: 'Billing Desk', route: '/real-estate/workspace/billing', roles: ['super_admin', 'agency_owner', 'manager'] },
  { key: 'usage-ledger', label: 'Usage Ledger', route: '/real-estate/workspace/usage', roles: ['super_admin', 'agency_owner', 'manager'] },
  { key: 'plan-upgrade-log', label: 'Plan Upgrade Log', route: '/real-estate/workspace/upgrade-log', roles: ['super_admin', 'agency_owner'] },
  { key: 'team-access', label: 'Team Access', route: '/real-estate/workspace/team', roles: ['super_admin', 'agency_owner'] },
  { key: 'featured-slot-booking', label: 'Featured Slot Booking', route: '/real-estate/workspace/featured-slots', roles: ['super_admin', 'agency_owner', 'manager'] },
  { key: 'campaign-analytics', label: 'Campaign Analytics', route: '/real-estate/workspace/analytics', roles: ['super_admin', 'agency_owner', 'manager'] },
  { key: 'saved-prospects', label: 'Saved Prospects', route: '/real-estate/workspace/saved-prospects', roles: ['super_admin', 'agency_owner', 'manager', 'agent'] },
  { key: 'assigned-leads', label: 'My Assigned Leads', route: '/real-estate/workspace/assigned-leads', roles: ['super_admin', 'agency_owner', 'manager', 'agent'] },
  { key: 'security-settings', label: 'Security Settings', route: '/real-estate/workspace/security', roles: ['super_admin', 'agency_owner'] },
];

function normalizeId(actor) {
  return actor?.id || actor?._id || actor?.sub || null;
}

async function loadActorContext(actor) {
  const actorId = normalizeId(actor);

  if (!actorId) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const user = await User.findById(actorId).lean();
  if (!user || user.deletedAt) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const role = normalizeWorkspaceRole(user.role || user.posterType || actor.role);
  return {
    actorId,
    orgId: user.orgId || null,
    role,
    user,
  };
}

function buildOwnershipFilter(context) {
  const filter = { deletedAt: null };
  if (context.orgId) {
    filter.orgId = context.orgId;
  } else {
    filter.poster = context.actorId;
  }
  return filter;
}

function buildModuleList(role) {
  return SELLER_MODULES.map((module) => ({
    ...module,
    available: canAccessRole(role, module.roles),
  }));
}

async function getOverview(actor) {
  const context = await loadActorContext(actor);
  const propertyFilter = buildOwnershipFilter(context);
  const ownedProperties = await Property.find(propertyFilter).select('_id').lean();
  const ownedPropertyIds = ownedProperties.map((property) => property._id);
  const [propertyCount, activePropertyCount, leadCount, savedCount, auditCount] = await Promise.all([
    Property.countDocuments(propertyFilter),
    Property.countDocuments({ ...propertyFilter, status: { $in: ['APPROVED', 'PENDING'] } }),
    Lead.countDocuments({
      deletedAt: null,
      ...(context.orgId ? { orgId: context.orgId } : { propertyId: { $in: ownedPropertyIds } }),
    }),
    context.orgId
      ? SavedItem.countDocuments({ orgId: context.orgId, removedAt: null })
      : SavedProperty.countDocuments({ userId: context.actorId }),
    AuditLog.countDocuments({ ...(context.orgId ? { orgId: context.orgId } : { actorId: context.actorId }), deletedAt: null }),
  ]);

  return {
    tenant: {
      strategy: context.orgId ? 'organization-scoped' : 'poster-owned',
      actorId: context.actorId,
      orgId: context.orgId,
      role: context.role,
    },
    summary: {
      propertyCount,
      activePropertyCount,
      leadCount,
      savedCount,
      auditCount,
    },
    modules: buildModuleList(context.role),
    status: {
      auth: 'ready',
      dataLayer: 'scaffolded',
      billing: 'ready-for-integration',
      notifications: 'event-ready',
    },
  };
}

function normalizePage(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function listWorkspaceProperties(actor, query = {}) {
  const context = await loadActorContext(actor);
  const propertyFilter = buildOwnershipFilter(context);

  const page = normalizePage(query.page, 1);
  const limit = Math.min(24, normalizePage(query.limit, 12));
  const skip = (page - 1) * limit;
  const status = query.status && query.status !== 'all' ? String(query.status).toUpperCase() : null;
  const category = query.category ? String(query.category).toUpperCase() : null;
  const city = query.city ? String(query.city).trim() : '';
  const search = String(query.search || '').trim();
  const sortBy = String(query.sortBy || 'createdAt');
  const sortDirection = String(query.sortDirection || 'desc').toLowerCase() === 'asc' ? 1 : -1;

  const filter = { ...propertyFilter };
  if (status) {
    filter.status = status;
  }
  if (category) {
    filter.category = category;
  }
  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { locality: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const safeSortBy = ['createdAt', 'updatedAt', 'price', 'title', 'status'].includes(sortBy) ? sortBy : 'createdAt';
  const sort = { [safeSortBy]: sortDirection, createdAt: -1 };
  const [items, totalCount] = await Promise.all([
    Property.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Property.countDocuments(filter),
  ]);

  return {
    success: true,
    data: items,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    },
    filters: {
      status: status || 'all',
      category: category || 'all',
      city,
      search,
      sortBy: safeSortBy,
      sortDirection: sortDirection === 1 ? 'asc' : 'desc',
    },
    tenant: {
      orgId: context.orgId,
      role: context.role,
    },
  };
}

async function listPackages(actor) {
  const context = await loadActorContext(actor);
  const filter = {
    deletedAt: null,
    isActive: true,
    $or: [
      { scope: 'global' },
      ...(context.orgId ? [{ scope: 'organization', orgId: context.orgId }] : []),
    ],
  };

  const packages = await PropertyPackage.find(filter).sort({ price: 1, durationDays: 1, tier: 1 }).lean();

  return {
    success: true,
    data: packages.map((pkg) => ({
      id: pkg._id,
      code: pkg.code,
      name: pkg.name,
      tier: pkg.tier,
      description: pkg.description,
      price: pkg.price,
      currency: pkg.currency,
      durationDays: pkg.durationDays,
      featuredSlots: pkg.featuredSlots,
      leadCredits: pkg.leadCredits,
      campaignCredits: pkg.campaignCredits,
      limits: pkg.limits || {},
      scope: pkg.scope,
      orgId: pkg.orgId || null,
    })),
    tenant: {
      orgId: context.orgId,
      role: context.role,
    },
  };
}

async function getCurrentPlan(actor) {
  const context = await loadActorContext(actor);
  if (!context.orgId) {
    return {
      success: true,
      data: null,
      message: 'No organization subscription is available for this account yet.',
    };
  }

  const subscription = await Subscription.findOne({ orgId: context.orgId, deletedAt: null }).sort({ createdAt: -1 }).lean();
  return {
    success: true,
    data: subscription ? {
      id: subscription._id,
      planCode: subscription.planCode,
      planName: subscription.planName,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      autoRenew: subscription.autoRenew,
      seatCount: subscription.seatCount,
      limitsSnapshot: subscription.limitsSnapshot || {},
      trialEndsAt: subscription.trialEndsAt,
    } : null,
    tenant: {
      orgId: context.orgId,
      role: context.role,
    },
  };
}

module.exports = {
  SELLER_MODULES,
  getOverview,
  listWorkspaceProperties,
  loadActorContext,
  listPackages,
  getCurrentPlan,
};