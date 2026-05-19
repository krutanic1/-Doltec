module.exports = function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errorCode: 'ROUTE_NOT_FOUND',
    traceId: req.requestId,
  });
};