const express = require('express');
const authenticate = require('../middleware/authenticate');
const leadController = require('../controllers/leadController');

const router = express.Router();

const jwt = require('jsonwebtoken');

// Public: Submit enquiry (optional auth)
router.post('/', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
        } catch (err) {
            // Ignore token error for public route
        }
    }
    next();
}, leadController.create);


// Protected: View/Manage leads
router.get('/', authenticate, leadController.list);
router.patch('/:id/status', authenticate, leadController.updateStatus);

module.exports = router;
