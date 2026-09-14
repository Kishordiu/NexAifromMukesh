const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Get Patient Profile
router.get('/profile', (req, res) => {
<<<<<<< HEAD
  try {
    const profile = db.prepare('SELECT * FROM patient_profiles WHERE user_id = ?').get(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
=======
 try {
 const profile = db.prepare('SELECT * FROM patient_profiles WHERE user_id = ?').get(req.user.id);
 if (!profile) {
 return res.status(404).json({ message: 'Profile not found.' });
 }
 res.json(profile);
 } catch (error) {
 res.status(500).json({ message: 'Server error fetching profile.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

// Create/Update Patient Profile
router.post('/profile', (req, res) => {
<<<<<<< HEAD
  const { name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact } = req.body;
  const user_id = req.user.id;
  
  try {
    const existing = db.prepare('SELECT id FROM patient_profiles WHERE user_id = ?').get(user_id);
    
    if (existing) {
      db.prepare(`
        UPDATE patient_profiles 
        SET name = ?, age = ?, pregnancy_week = ?, edd = ?, blood_group = ?, conditions = ?, 
            emergency_contact = ?, emergency_contact_name = ?, language = ?, asha_contact = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).run(name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact, user_id);
      
      const updated = db.prepare('SELECT * FROM patient_profiles WHERE user_id = ?').get(user_id);
      return res.json(updated);
    } else {
      const id = crypto.randomUUID();
      db.prepare(`
        INSERT INTO patient_profiles (id, user_id, name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, user_id, name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact);
      
      const created = db.prepare('SELECT * FROM patient_profiles WHERE id = ?').get(id);
      return res.status(201).json(created);
    }
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ message: 'Server error saving profile.' });
  }
=======
 const { name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact } = req.body;
 const user_id = req.user.id;
 
 try {
 const existing = db.prepare('SELECT id FROM patient_profiles WHERE user_id = ?').get(user_id);
 
 if (existing) {
 db.prepare(`
 UPDATE patient_profiles 
 SET name = ?, age = ?, pregnancy_week = ?, edd = ?, blood_group = ?, conditions = ?, 
 emergency_contact = ?, emergency_contact_name = ?, language = ?, asha_contact = ?, updated_at = CURRENT_TIMESTAMP
 WHERE user_id = ?
 `).run(name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact, user_id);
 
 const updated = db.prepare('SELECT * FROM patient_profiles WHERE user_id = ?').get(user_id);
 return res.json(updated);
 } else {
 const id = crypto.randomUUID();
 db.prepare(`
 INSERT INTO patient_profiles (id, user_id, name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
 `).run(id, user_id, name, age, pregnancy_week, edd, blood_group, conditions, emergency_contact, emergency_contact_name, language, asha_contact);
 
 const created = db.prepare('SELECT * FROM patient_profiles WHERE id = ?').get(id);
 return res.status(201).json(created);
 }
 } catch (error) {
 console.error('Profile save error:', error);
 res.status(500).json({ message: 'Server error saving profile.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

// Get all measurements
router.get('/measurements', (req, res) => {
<<<<<<< HEAD
  try {
    const measurements = db.prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching measurements.' });
  }
=======
 try {
 const measurements = db.prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
 res.json(measurements);
 } catch (error) {
 res.status(500).json({ message: 'Server error fetching measurements.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

// Get latest measurements (grouped by type)
router.get('/measurements/latest', (req, res) => {
<<<<<<< HEAD
  try {
    // Uses SQLite window functions or max aggregation. Simplified approach:
    const types = db.prepare('SELECT DISTINCT type FROM measurements WHERE user_id = ?').all(req.user.id);
    const latest = [];
    
    const stmt = db.prepare('SELECT * FROM measurements WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1');
    
    for (const { type } of types) {
      const record = stmt.get(req.user.id, type);
      if (record) latest.push(record);
    }
    
    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching latest measurements.' });
  }
=======
 try {
 // Uses SQLite window functions or max aggregation. Simplified approach:
 const types = db.prepare('SELECT DISTINCT type FROM measurements WHERE user_id = ?').all(req.user.id);
 const latest = [];
 
 const stmt = db.prepare('SELECT * FROM measurements WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1');
 
 for (const { type } of types) {
 const record = stmt.get(req.user.id, type);
 if (record) latest.push(record);
 }
 
 res.json(latest);
 } catch (error) {
 res.status(500).json({ message: 'Server error fetching latest measurements.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

// Save new measurement
router.post('/measurements', (req, res) => {
<<<<<<< HEAD
  const { type, value, unit, confidence, signal_quality, metadata } = req.body;
  
  if (!type) {
    return res.status(400).json({ message: 'Measurement type is required.' });
  }
  
  try {
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO measurements (id, user_id, type, value, unit, confidence, signal_quality, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, type, value, unit, confidence, signal_quality, metadata ? JSON.stringify(metadata) : null);
    
    const saved = db.prepare('SELECT * FROM measurements WHERE id = ?').get(id);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error saving measurement.' });
  }
=======
 const { type, value, unit, confidence, signal_quality, metadata } = req.body;
 
 if (!type) {
 return res.status(400).json({ message: 'Measurement type is required.' });
 }
 
 try {
 const id = crypto.randomUUID();
 db.prepare(`
 INSERT INTO measurements (id, user_id, type, value, unit, confidence, signal_quality, metadata)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
 `).run(id, req.user.id, type, value, unit, confidence, signal_quality, metadata ? JSON.stringify(metadata) : null);
 
 const saved = db.prepare('SELECT * FROM measurements WHERE id = ?').get(id);
 res.status(201).json(saved);
 } catch (error) {
 res.status(500).json({ message: 'Server error saving measurement.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

// Get lab reports
router.get('/lab-reports', (req, res) => {
<<<<<<< HEAD
  try {
    const reports = db.prepare('SELECT * FROM lab_reports WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching lab reports.' });
  }
=======
 try {
 const reports = db.prepare('SELECT * FROM lab_reports WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
 res.json(reports);
 } catch (error) {
 res.status(500).json({ message: 'Server error fetching lab reports.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

// Save lab report
router.post('/lab-reports', (req, res) => {
<<<<<<< HEAD
  const { fields, ocr_raw, verified, source } = req.body;
  
  try {
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO lab_reports (id, user_id, fields, ocr_raw, verified, source)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, JSON.stringify(fields), ocr_raw, verified ? 1 : 0, source);
    
    const saved = db.prepare('SELECT * FROM lab_reports WHERE id = ?').get(id);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error saving lab report.' });
  }
=======
 const { fields, ocr_raw, verified, source } = req.body;
 
 try {
 const id = crypto.randomUUID();
 db.prepare(`
 INSERT INTO lab_reports (id, user_id, fields, ocr_raw, verified, source)
 VALUES (?, ?, ?, ?, ?, ?)
 `).run(id, req.user.id, JSON.stringify(fields), ocr_raw, verified ? 1 : 0, source);
 
 const saved = db.prepare('SELECT * FROM lab_reports WHERE id = ?').get(id);
 res.status(201).json(saved);
 } catch (error) {
 res.status(500).json({ message: 'Server error saving lab report.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

module.exports = router;
