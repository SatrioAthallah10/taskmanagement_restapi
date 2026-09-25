const express = require('express');
const router = express.Router();

const {
  semuaTugas,
  tugasBerdasarkanId,
  buatTugas,
  updateTugas,
  updateStatus,
  hapusTugas,
} = require('../controllers/tugasController');

const {
  aturanBuatTugas,
  aturanUpdateTugas,
  aturanUpdateStatus,
  aturanParamId,
  periksaValidasi,
} = require('../middleware/validasi');

router.get('/', semuaTugas);
router.get('/:id', aturanParamId, periksaValidasi, tugasBerdasarkanId);
router.post('/', aturanBuatTugas, periksaValidasi, buatTugas);
router.put('/:id', aturanParamId, aturanUpdateTugas, periksaValidasi, updateTugas);
router.patch('/:id/status', aturanParamId, aturanUpdateStatus, periksaValidasi, updateStatus);
router.delete('/:id', aturanParamId, periksaValidasi, hapusTugas);

module.exports = router;
