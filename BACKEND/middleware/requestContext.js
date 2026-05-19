const crypto = require('crypto');

module.exports = function requestContext(req, res, next) {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', requestId);
  req.requestId = requestId;
  req.context = {
    requestId,
    orgId: req.headers['x-org-id'] || req.headers['x-organization-id'] || null,
    tenantKey: req.headers['x-tenant-id'] || null,
  };
  next();
};