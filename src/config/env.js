const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://root:Pyme2025*@panel.hubcapture.com:5432/n8n_db?sslmode=disable',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12
};

module.exports = env;
