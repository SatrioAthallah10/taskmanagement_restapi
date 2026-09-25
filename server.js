const { aplikasi } = require('./src/app');
const { logger } = require('./src/utils/logger');

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  aplikasi.listen(PORT, () => {
    logger.info(`Server berjalan di port ${PORT}`);
  });
}

module.exports = aplikasi;
