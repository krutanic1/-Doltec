function serializeError(error) {
  if (!error) {
    return null;
  }

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    code: error.code,
    statusCode: error.statusCode,
  };
}

function log(level, message, meta = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const writer = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  writer(JSON.stringify(payload));
}

module.exports = {
  debug(message, meta) {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, meta);
    }
  },
  info(message, meta) {
    log('info', message, meta);
  },
  warn(message, meta) {
    log('warn', message, meta);
  },
  error(message, error, meta = {}) {
    log('error', message, { ...meta, error: serializeError(error) });
  },
};