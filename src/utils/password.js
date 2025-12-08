const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const env = require('../config/env');

const hashPassword = (plain) => bcrypt.hash(plain, env.bcryptSaltRounds);

const verifyPassword = (plain, hashed) => bcrypt.compare(plain, hashed);

const generateSessionToken = () => crypto.randomBytes(48).toString('hex');

module.exports = {
  hashPassword,
  verifyPassword,
  generateSessionToken
};
