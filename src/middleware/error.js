const { logger } = require('../utils/logger');

const penangananError = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  const kodeStatus = err.statusCode || 500;
  const pesanError = err.message || 'Terjadi kesalahan pada server';

  res.status(kodeStatus).json({
    success: false,
    message: pesanError,
  });
};

const tidakDitemukan = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
};

module.exports = { penangananError, tidakDitemukan };
