const inquiryService = require('../services/inquiryService');

async function createInquiry(req, res, next) {
  try {
    const orgId = req.context?.orgId;
    const payload = Object.assign({}, req.body, { orgId });
    const created = await inquiryService.createInquiry(payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
}

async function listInquiries(req, res, next) {
  try {
    const orgId = req.context?.orgId;
    const { page = 1, limit = 20, search, status, assignedTo } = req.query;
    const result = await inquiryService.listInquiries({
      page: Number(page),
      limit: Number(limit),
      search,
      filter: { status, assignedTo },
      orgId,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getInquiry(req, res, next) {
  try {
    const orgId = req.context?.orgId;
    const { id } = req.params;
    const item = await inquiryService.getInquiryById(id, { orgId });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

async function updateInquiry(req, res, next) {
  try {
    const orgId = req.context?.orgId;
    const { id } = req.params;
    const updates = req.body;
    const updated = await inquiryService.updateInquiry(id, updates, { orgId });
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteInquiry(req, res, next) {
  try {
    const orgId = req.context?.orgId;
    const { id } = req.params;
    const deleted = await inquiryService.softDeleteInquiry(id, { orgId });
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createInquiry,
  listInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
};
