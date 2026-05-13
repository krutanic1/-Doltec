const service = require('../services/realEstateService');

async function list(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const filters = {};
    const result = await service.listProperties({ page, limit, filters });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('realEstateController.list', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const prop = await service.getPropertyById(id);
    if (!prop) return res.status(404).json({ success: false, error: 'Not Found' });
    return res.status(200).json({ success: true, data: prop });
  } catch (err) {
    console.error('realEstateController.getById', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { list, getById };
