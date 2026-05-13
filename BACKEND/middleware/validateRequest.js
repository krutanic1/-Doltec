module.exports = function validateRequest(validator) {
  return (req, res, next) => {
    const { error, value } = validator(req.body || {});
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details || [{ message: error.message }],
      });
    }

    req.body = value;
    return next();
  };
};
