const { v4: buatUuid } = require('uuid');
const { db } = require('../database/koneksi');

const semuaTugas = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM tugas ORDER BY dibuat_pada DESC');

    const hasilFormatted = rows.map(formatTugas);

    res.status(200).json({
      success: true,
      total: hasilFormatted.length,
      data: hasilFormatted,
    });
  } catch (err) {
    next(err);
  }
};

const tugasBerdasarkanId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM tugas WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    res.status(200).json({
      success: true,
      data: formatTugas(rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

const buatTugas = async (req, res, next) => {
  try {
    const { title, description = '', status = 'pending', priority = 'medium' } = req.body;

    const idBaru = buatUuid();
    const waktuSekarang = new Date().toISOString();

    await db.query(`
      INSERT INTO tugas (id, judul, deskripsi, status, prioritas, dibuat_pada, diperbarui_pada)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [idBaru, title, description, status, priority, waktuSekarang, waktuSekarang]);

    const { rows } = await db.query('SELECT * FROM tugas WHERE id = $1', [idBaru]);

    res.status(201).json({
      success: true,
      message: 'Tugas berhasil dibuat',
      data: formatTugas(rows[0]),
    });
  } catch (err) {
    next(err);
  }
};

const updateTugas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: rowsLama } = await db.query('SELECT * FROM tugas WHERE id = $1', [id]);

    if (rowsLama.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }
    
    const tugasLama = rowsLama[0];

    const { title, description, status, priority } = req.body;
    const judulBaru = title !== undefined ? title : tugasLama.judul;
    const deskripsiBaru = description !== undefined ? description : tugasLama.deskripsi;
    const statusBaru = status !== undefined ? status : tugasLama.status;
    const prioritasBaru = priority !== undefined ? priority : tugasLama.prioritas;
    const waktuUpdate = new Date().toISOString();

    await db.query(`
      UPDATE tugas SET judul = $1, deskripsi = $2, status = $3, prioritas = $4, diperbarui_pada = $5
      WHERE id = $6
    `, [judulBaru, deskripsiBaru, statusBaru, prioritasBaru, waktuUpdate, id]);

    const { rows: rowsBaru } = await db.query('SELECT * FROM tugas WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Tugas berhasil diperbarui',
      data: formatTugas(rowsBaru[0]),
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { rows: rowsLama } = await db.query('SELECT * FROM tugas WHERE id = $1', [id]);

    if (rowsLama.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    const waktuUpdate = new Date().toISOString();

    await db.query('UPDATE tugas SET status = $1, diperbarui_pada = $2 WHERE id = $3', [
      status,
      waktuUpdate,
      id
    ]);

    const { rows: rowsBaru } = await db.query('SELECT * FROM tugas WHERE id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Status tugas berhasil diperbarui',
      data: formatTugas(rowsBaru[0]),
    });
  } catch (err) {
    next(err);
  }
};

const hapusTugas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM tugas WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tugas dengan id "${id}" tidak ditemukan`,
      });
    }

    await db.query('DELETE FROM tugas WHERE id = $1', [id]);

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
