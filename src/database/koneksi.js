const { Pool } = require('pg');
require('dotenv').config();
const { logger } = require('../utils/logger');

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.connect()
  .then(() => {
    logger.info('Database terhubung ke PostgreSQL');
  })
  .catch((err) => {
    logger.error('Error menghubungkan ke PostgreSQL', err);
  });

module.exports = { db };
