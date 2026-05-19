const listingService = require('../services/listingService');

/**
 * GET /api/v1/listings
 */
exports.getListings = async (req, res, next) => {
  try {
    const result = await listingService.listListings(req.user, req.query);
    res.status(200).json({
      success: true,
      data: result.listings,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/listings/:id
 */
exports.getListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.getListingById(id, req.user);
    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/listings
 */
exports.createListing = async (req, res, next) => {
  try {
    const listing = await listingService.createListing(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/listings/:id
 */
exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.updateListing(id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/listings/:id/status
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const listing = await listingService.updateStatus(id, status, req.user);
    res.status(200).json({
      success: true,
      message: `Listing status updated to ${status}`,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/listings/:id/tier
 */
exports.upgradeTier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tier } = req.body;

    if (!tier) {
      return res.status(400).json({ success: false, message: 'Tier value is required' });
    }

    const listing = await listingService.upgradeTier(id, tier, req.user);
    res.status(200).json({
      success: true,
      message: `Listing package upgraded to ${tier}`,
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/listings/:id
 */
exports.softDeleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await listingService.softDeleteListing(id, req.user);
    res.status(200).json({
      success: true,
      message: 'Listing soft-deleted successfully',
      data: listing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/listings/bulk-action
 */
exports.bulkAction = async (req, res, next) => {
  try {
    const { ids, action } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Array of ids is required' });
    }
    if (!action) {
      return res.status(400).json({ success: false, message: 'Action is required' });
    }

    const result = await listingService.bulkAction(ids, action, req.user);
    
    // Return multi-status 207 if there were any failures
    const statusCode = result.failed.length > 0 ? 207 : 200;
    res.status(statusCode).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/listings/stats/summary
 */
exports.getStatsSummary = async (req, res, next) => {
  try {
    const stats = await listingService.getStatsSummary(req.user);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/listings/tier/:tier
 */
exports.getListingsByTier = async (req, res, next) => {
  try {
    const { tier } = req.params;
    const queryWithTier = { ...req.query, tier };
    const result = await listingService.listListings(req.user, queryWithTier);
    res.status(200).json({
      success: true,
      data: result.listings,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};
