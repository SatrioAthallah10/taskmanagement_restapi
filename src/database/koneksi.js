const Database = require('better-sqlite3');
const path = require('path');
const { logger } = require('../utils/logger');

const jalurDatabase = path.join(__dirname, '../../data/tugas.db');

const db = new Database(jalurDatabase);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tugas (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    deskripsi TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    prioritas TEXT NOT NULL DEFAULT 'medium',
    dibuat_pada TEXT NOT NULL,
    diperbarui_pada TEXT NOT NULL
  )
`);

logger.info('Database terhubung dan tabel siap');

module.exports = { db };
