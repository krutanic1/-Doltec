const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');

// @route   GET api/v1/properties
// @desc    Get all properties (with filters)
// @access  Public
router.get('/', propertyController.getProperties);
router.get('/cities', propertyController.getCities);

// @route   GET api/v1/properties/:slug
// @desc    Get property by slug
// @access  Public
router.get('/my-properties', auth, propertyController.getMyProperties);
router.get('/:slug', propertyController.getPropertyBySlug);
router.put('/:slug', auth, propertyController.updateProperty);

// @route   POST api/v1/properties
// @desc    Create a new property
// @access  Private
router.post('/', auth, propertyController.createProperty);
router.patch('/:id/moderate', auth, propertyController.moderateProperty);

module.exports = router;
