const HttpError = require('../utils/httpError');
const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  next(new HttpError(404, `Ruta ${req.method} ${req.originalUrl} no encontrada`));
};

const genericError = (err, req, res, next) => {
  const status = err instanceof HttpError ? err.statusCode : 500;
  const payload = {
    message: err.message || 'Error inesperado',
    ...(err.details && { details: err.details })
  };

  if (status >= 500) {
    logger.error('Internal error', { err: err.message, stack: err.stack });
  }

  res.status(status).json({
    success: false,
    error: payload
  });
};

module.exports = {
  notFound,
  genericError
};
