const express = require('express');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const teamController = require('../controllers/teamController');

const router = express.Router();

const workspaceRoles = ['super_admin', 'agency_owner', 'manager', 'agent', 'support', 'ADMIN', 'OWNER', 'BUILDER', 'AGENT', 'USER'];

router.get('/', auth, rbac({ roles: workspaceRoles }), teamController.getTeamMembers);
router.post('/invite', auth, rbac({ roles: workspaceRoles }), teamController.inviteTeamMember);
router.put('/:id/status', auth, rbac({ roles: workspaceRoles }), teamController.updateTeamMemberStatus);

module.exports = router;
