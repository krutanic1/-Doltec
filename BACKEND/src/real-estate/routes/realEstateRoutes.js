const express = require('express');
const controller = require('../controllers/realEstateController');

const router = express.Router();

router.get('/api/v1/properties', controller.list);
router.get('/api/v1/properties/:id', controller.getById);

module.exports = router;
