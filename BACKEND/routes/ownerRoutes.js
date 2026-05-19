const express = require('express');
const router = express.Router();
const leadUnlockController = require('../controllers/leadUnlockController');
const auth = require('../middleware/auth');

// Note: Stats route should be declared BEFORE leadId route to prevent matching it as an ID
router.get('/leads/stats/summary', auth, leadUnlockController.getLeadsStatsSummary);

// Owner leads pipelines
router.get('/leads', auth, leadUnlockController.getOwnerLeads);
router.get('/leads/:leadId', auth, leadUnlockController.getOwnerLeadById);
router.patch('/leads/:leadId/status', auth, leadUnlockController.updateLeadStatus);

// Property-specific leads
router.get('/properties/:propertyId/leads', auth, leadUnlockController.getPropertyLeads);

module.exports = router;
