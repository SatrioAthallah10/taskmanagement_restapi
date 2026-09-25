const { v4: buatUuid } = require('uuid');
const { db } = require('../database/koneksi');

const semuaTugas = (req, res, next) => {
  try {
    const daftarTugas = db.prepare('SELECT * FROM tugas ORDER BY dibuat_pada DESC').all();

    const hasilFormatted = daftarTugas.map(formatTugas);

    res.status(200).json({
      success: true,
      total: hasilFormatted.length,
      data: hasilFormatted,
    });
  } catch (err) {
    next(err);
  }
};

const tugasBerdasarkanId = (req, res, next) => {
  try {
    const { id } = req.params;
    const tugasDitemukan = db.prepare('SELECT * FROM tugas WHERE id = ?').get(id);

    if (!tugasDitemukan) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    res.status(200).json({
      success: true,
      data: formatTugas(tugasDitemukan),
    });
  } catch (err) {
    next(err);
  }
};

const buatTugas = (req, res, next) => {
  try {
    const { title, description = '', status = 'pending', priority = 'medium' } = req.body;

    const idBaru = buatUuid();
    const waktuSekarang = new Date().toISOString();

    db.prepare(`
      INSERT INTO tugas (id, judul, deskripsi, status, prioritas, dibuat_pada, diperbarui_pada)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(idBaru, title, description, status, priority, waktuSekarang, waktuSekarang);

    const tugas = db.prepare('SELECT * FROM tugas WHERE id = ?').get(idBaru);

    res.status(201).json({
      success: true,
      message: 'Tugas berhasil dibuat',
      data: formatTugas(tugas),
    });
  } catch (err) {
    next(err);
  }
};

const updateTugas = (req, res, next) => {
  try {
    const { id } = req.params;
    const tugasLama = db.prepare('SELECT * FROM tugas WHERE id = ?').get(id);

    if (!tugasLama) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    const { title, description, status, priority } = req.body;
    const judulBaru = title !== undefined ? title : tugasLama.judul;
    const deskripsiBaru = description !== undefined ? description : tugasLama.deskripsi;
    const statusBaru = status !== undefined ? status : tugasLama.status;
    const prioritasBaru = priority !== undefined ? priority : tugasLama.prioritas;
    const waktuUpdate = new Date().toISOString();

    db.prepare(`
      UPDATE tugas SET judul = ?, deskripsi = ?, status = ?, prioritas = ?, diperbarui_pada = ?
      WHERE id = ?
    `).run(judulBaru, deskripsiBaru, statusBaru, prioritasBaru, waktuUpdate, id);

    const tugasTerbaru = db.prepare('SELECT * FROM tugas WHERE id = ?').get(id);

    res.status(200).json({
      success: true,
      message: 'Tugas berhasil diperbarui',
      data: formatTugas(tugasTerbaru),
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const tugasDitemukan = db.prepare('SELECT * FROM tugas WHERE id = ?').get(id);

    if (!tugasDitemukan) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    const waktuUpdate = new Date().toISOString();

    db.prepare('UPDATE tugas SET status = ?, diperbarui_pada = ? WHERE id = ?').run(
      status,
      waktuUpdate,
      id
    );

    const tugasTerbaru = db.prepare('SELECT * FROM tugas WHERE id = ?').get(id);

    res.status(200).json({
      success: true,
      message: 'Status tugas berhasil diperbarui',
      data: formatTugas(tugasTerbaru),
    });
  } catch (err) {
    next(err);
  }
};

const hapusTugas = (req, res, next) => {
  try {
    const { id } = req.params;
    const tugasDitemukan = db.prepare('SELECT * FROM tugas WHERE id = ?').get(id);

    if (!tugasDitemukan) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    db.prepare('DELETE FROM tugas WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Tugas berhasil dihapus',
    });
  } catch (err) {
    next(err);
  }
};

function formatTugas(tugas) {
  return {
    id: tugas.id,
    title: tugas.judul,
    description: tugas.deskripsi,
    status: tugas.status,
    priority: tugas.prioritas,
    createdAt: tugas.dibuat_pada,
    updatedAt: tugas.diperbarui_pada,
  };
}

module.exports = {
  semuaTugas,
  tugasBerdasarkanId,
  buatTugas,
  updateTugas,
  updateStatus,
  hapusTugas,
};
