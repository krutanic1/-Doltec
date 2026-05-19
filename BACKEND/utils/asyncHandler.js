module.exports = function asyncHandler(fn) {
  return function asyncHandlerWrapper(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};