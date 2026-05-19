const express = require('express');
const auth = require('../middleware/auth');
const sellerWorkspaceController = require('../controllers/sellerWorkspaceController');
const rbac = require('../middleware/rbac');

const router = express.Router();

const workspaceRoles = ['super_admin', 'agency_owner', 'manager', 'agent', 'support', 'ADMIN', 'OWNER', 'BUILDER', 'AGENT', 'USER'];

router.get('/overview', auth, rbac({ roles: workspaceRoles }), sellerWorkspaceController.getOverview);
router.get('/properties', auth, rbac({ roles: workspaceRoles }), sellerWorkspaceController.listProperties);
router.get('/packages', auth, rbac({ roles: ['super_admin', 'agency_owner', 'manager', 'ADMIN', 'OWNER', 'BUILDER'] }), sellerWorkspaceController.listPackages);
router.get('/plans/current', auth, rbac({ roles: ['super_admin', 'agency_owner', 'manager', 'ADMIN', 'OWNER', 'BUILDER'] }), sellerWorkspaceController.getCurrentPlan);

module.exports = router;