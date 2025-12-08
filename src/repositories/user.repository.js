const pool = require('../db/pool');

const USER_FIELDS =
  'id, email, first_name, last_name, password_hash, last_login, created_at, updated_at';

const findByEmail = async (email) => {
  const query = `SELECT ${USER_FIELDS} FROM auth_users WHERE email = $1 LIMIT 1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const updateLastLogin = async (userId) => {
  const query = 'UPDATE auth_users SET last_login = NOW(), updated_at = NOW() WHERE id = $1';
  await pool.query(query, [userId]);
};

const createUser = async ({ email, firstName, lastName, passwordHash }) => {
  const query = `
    INSERT INTO auth_users (email, first_name, last_name, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING ${USER_FIELDS}
  `;

  const { rows } = await pool.query(query, [email, firstName, lastName, passwordHash]);
  return rows[0];
};

module.exports = {
  findByEmail,
  updateLastLogin,
  createUser
};
