const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'nexai.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

const initSchema = () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'patient',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patient_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE REFERENCES users(id),
      name TEXT,
      age INTEGER,
      pregnancy_week INTEGER,
      edd TEXT,
      blood_group TEXT,
      conditions TEXT,
      emergency_contact TEXT,
      emergency_contact_name TEXT,
      language TEXT DEFAULT 'en',
      asha_contact TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS measurements (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      type TEXT NOT NULL,
      value REAL,
      unit TEXT,
      confidence REAL,
      signal_quality TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vision_scans (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      type TEXT NOT NULL,
      result TEXT,
      confidence REAL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lab_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      fields TEXT,
      ocr_raw TEXT,
      verified INTEGER DEFAULT 0,
      source TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS symptom_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      transcript TEXT,
      language TEXT,
      extracted_symptoms TEXT,
      triage_response TEXT,
      urgency TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS risk_assessments (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      level TEXT,
      score REAL,
      factors TEXT,
      reasons TEXT,
      recommendations TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS emergency_events (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      type TEXT,
      payload TEXT,
      status TEXT DEFAULT 'pending',
      sent_at TEXT,
      acknowledged_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      title TEXT,
      content TEXT,
      verification_id TEXT UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS domains (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      image TEXT,
      slug TEXT UNIQUE,
      status TEXT DEFAULT 'draft',
      featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS organisers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      organization TEXT,
      description TEXT,
      image TEXT,
      contact_details TEXT,
      status TEXT DEFAULT 'active',
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.exec(schema);
};

initSchema();

module.exports = db;
