const { body, param, validationResult } = require('express-validator');

const aturanBuatTugas = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title wajib diisi')
    .isLength({ max: 255 })
    .withMessage('title maksimal 255 karakter'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('description maksimal 2000 karakter'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('status harus: pending, in-progress, atau done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('priority harus: low, medium, atau high'),
];

const aturanUpdateTugas = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('title tidak boleh kosong')
    .isLength({ max: 255 })
    .withMessage('title maksimal 255 karakter'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('description maksimal 2000 karakter'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('status harus: pending, in-progress, atau done'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('priority harus: low, medium, atau high'),
];

const aturanUpdateStatus = [
  body('status')
    .notEmpty()
    .withMessage('status wajib diisi')
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('status harus: pending, in-progress, atau done'),
];

const aturanParamId = [
  param('id')
    .notEmpty()
    .withMessage('id tidak valid'),
];

const periksaValidasi = (req, res, next) => {
  const hasilValidasi = validationResult(req);
  if (!hasilValidasi.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: hasilValidasi.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  aturanBuatTugas,
  aturanUpdateTugas,
  aturanUpdateStatus,
  aturanParamId,
  periksaValidasi,
};
