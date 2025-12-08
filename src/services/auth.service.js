const userRepository = require('../repositories/user.repository');
const passwordUtils = require('../utils/password');
const sessionStore = require('../utils/sessionStore');
const HttpError = require('../utils/httpError');

const login = async ({ email, password }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    throw new HttpError(401, 'Credenciales inválidas');
  }

  const isValidPassword = await passwordUtils.verifyPassword(password, user.password_hash);

  if (!isValidPassword) {
    throw new HttpError(401, 'Credenciales inválidas');
  }

  await userRepository.updateLastLogin(user.id);
  const sessionToken = sessionStore.createSession(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      lastLogin: user.last_login,
      createdAt: user.created_at
    },
    sessionToken
  };
};

module.exports = {
  login
};
