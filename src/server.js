const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const pool = require('./db/pool');

const start = async () => {
  try {
    await pool.query('SELECT 1');
    logger.info('Conexión a base de datos verificada');
  } catch (error) {
    logger.error('No fue posible conectarse a la base de datos', { error: error.message });
    process.exit(1);
  }

  app.listen(env.port, () => {
    logger.info(`API escuchando en puerto ${env.port}`);
  });
};

start();
