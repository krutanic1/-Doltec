const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const listingController = require('../controllers/listingController');

// All workspace listings roles
const workspaceRoles = [
  'super_admin', 'agency_owner', 'manager', 'agent', 'support',
  'ADMIN', 'OWNER', 'BUILDER', 'AGENT', 'USER'
];

/**
 * @route   GET /api/v1/listings
 * @desc    Get all active/filtered listings for the authenticated user/org
 */
router.get('/', auth, rbac({ roles: workspaceRoles }), listingController.getListings);

/**
 * @route   GET /api/v1/listings/stats/summary
 * @desc    Get summary counts by status/tier + organization featured credits
 */
router.get('/stats/summary', auth, rbac({ roles: workspaceRoles }), listingController.getStatsSummary);

/**
 * @route   GET /api/v1/listings/tier/:tier
 * @desc    Get listings matching a specific tier (PLAIN, BASIC, PLATINUM, PREMIUM)
 */
router.get('/tier/:tier', auth, rbac({ roles: workspaceRoles }), listingController.getListingsByTier);

/**
 * @route   POST /api/v1/listings/bulk-action
 * @desc    Execute status upgrades or archivals on multiple listing IDs in bulk
 */
router.post('/bulk-action', auth, rbac({ roles: workspaceRoles }), listingController.bulkAction);

/**
 * @route   GET /api/v1/listings/:id
 * @desc    Get listing details by ID
 */
router.get('/:id', auth, rbac({ roles: workspaceRoles }), listingController.getListing);

/**
 * @route   POST /api/v1/listings
 * @desc    Create a new listing
 */
router.post('/', auth, rbac({ roles: workspaceRoles }), listingController.createListing);

/**
 * @route   PATCH /api/v1/listings/:id
 * @desc    Edit a listing
 */
router.patch('/:id', auth, rbac({ roles: workspaceRoles }), listingController.updateListing);

/**
 * @route   PATCH /api/v1/listings/:id/status
 * @desc    Pause, draft, or archive a listing status
 */
router.patch('/:id/status', auth, rbac({ roles: workspaceRoles }), listingController.updateStatus);

/**
 * @route   PATCH /api/v1/listings/:id/tier
 * @desc    Upgrade listing tier (Basic/Platinum/Premium)
 */
router.patch('/:id/tier', auth, rbac({ roles: workspaceRoles }), listingController.upgradeTier);

/**
 * @route   DELETE /api/v1/listings/:id
 * @desc    Soft-delete listing (places into deleted status)
 */
router.delete('/:id', auth, rbac({ roles: workspaceRoles }), listingController.softDeleteListing);

module.exports = router;
