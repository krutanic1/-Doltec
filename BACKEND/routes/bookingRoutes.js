const express = require('express');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

const workspaceRoles = ['super_admin', 'agency_owner', 'manager', 'agent', 'support', 'ADMIN', 'OWNER', 'BUILDER', 'AGENT', 'USER'];

router.get('/', auth, rbac({ roles: workspaceRoles }), bookingController.getFeaturedBookings);
router.post('/book', auth, rbac({ roles: workspaceRoles }), bookingController.createFeaturedBooking);

module.exports = router;
