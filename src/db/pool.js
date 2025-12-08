const { Pool } = require('pg');
const env = require('../config/env');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', err);
});

module.exports = pool;
