const crypto = require('crypto');

const sessions = new Map();

const createSession = (userId) => {
  const token = crypto.randomBytes(48).toString('hex');
  sessions.set(token, {
    userId,
    createdAt: new Date()
  });
  return token;
};

const validateSession = (token) => {
  if (!token) {
    return null;
  }
  return sessions.get(token) || null;
};

const revokeSession = (token) => {
  sessions.delete(token);
};

module.exports = {
  createSession,
  validateSession,
  revokeSession
};
