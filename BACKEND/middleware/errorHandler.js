const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const normalizedError = err instanceof AppError
    ? err
    : new AppError(err.message || 'Internal Server Error', err.statusCode || 500, err.code || 'INTERNAL_ERROR', err.details || null);

  logger.error('Request failed', normalizedError, {
    requestId: req.requestId,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(normalizedError.statusCode || 500).json({
    success: false,
    message: normalizedError.message,
    errorCode: normalizedError.code,
    details: normalizedError.details,
    traceId: req.requestId,
  });
};