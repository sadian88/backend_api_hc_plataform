const sessionStore = require('../utils/sessionStore');
const HttpError = require('../utils/httpError');

const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  const session = sessionStore.validateSession(token);

  if (!session) {
    return next(new HttpError(401, 'Sesión inválida o expirada'));
  }

  req.session = session;
  return next();
};

module.exports = authGuard;
