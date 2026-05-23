const express = require('express');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const campaignAnalyticsController = require('../controllers/campaignAnalyticsController');

const router = express.Router();

const workspaceRoles = ['super_admin', 'agency_owner', 'manager', 'agent', 'support', 'ADMIN', 'OWNER', 'BUILDER', 'AGENT', 'USER'];

router.get('/analytics', auth, rbac({ roles: workspaceRoles }), campaignAnalyticsController.getCampaignPerformance);

module.exports = router;
