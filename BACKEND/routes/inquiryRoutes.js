const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const authenticate = require('../middleware/authenticate');

// Public create (for external website contact forms) and protected listing for workspace users
router.post('/', inquiryController.createInquiry);

// Protected routes
router.get('/', authenticate, inquiryController.listInquiries);
router.get('/:id', authenticate, inquiryController.getInquiry);
router.patch('/:id', authenticate, inquiryController.updateInquiry);
router.delete('/:id', authenticate, inquiryController.deleteInquiry);

module.exports = router;
