const express = require('express');
const { logger } = require('./utils/logger');
const tugasRoute = require('./routes/tugasRoute');
const { penangananError, tidakDitemukan } = require('./middleware/error');

const aplikasi = express();

aplikasi.use(express.json());
aplikasi.use(express.urlencoded({ extended: true }));

aplikasi.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

aplikasi.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server berjalan dengan baik' });
});

aplikasi.use('/api/tasks', tugasRoute);

aplikasi.use(tidakDitemukan);
aplikasi.use(penangananError);

module.exports = { aplikasi };
