const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public Verification Endpoint
router.get('/verify/:verificationId', (req, res) => {
  try {
    const report = db.prepare(`
      SELECT r.created_at, p.name 
      FROM reports r 
      JOIN patient_profiles p ON r.user_id = p.user_id 
      WHERE r.verification_id = ?
    `).get(req.params.verificationId);

    if (!report) {
      return res.status(404).json({ valid: false, message: 'Invalid or expired verification code.' });
    }

    // Return initials only for privacy
    const initials = report.name ? report.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'XX';

    res.json({
      valid: true,
      created_at: report.created_at,
      patient_initials: initials
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during verification.' });
  }
});

router.use(requireAuth);

// List reports
router.get('/', (req, res) => {
  try {
    const reports = db.prepare('SELECT id, title, verification_id, created_at FROM reports WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reports.' });
  }
});

// Generate new report
router.post('/generate', (req, res) => {
  const userId = req.user.id;

  try {
    const profile = db.prepare('SELECT * FROM patient_profiles WHERE user_id = ?').get(userId);
    const risk = db.prepare('SELECT * FROM risk_assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
    const vitals = db.prepare('SELECT * FROM measurements WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(userId);
    
    // Generate an 8-character uppercase alphanumeric verification ID
    const verificationId = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    const reportContent = {
      patient: profile || { name: 'Unknown' },
      latest_risk: risk ? { level: risk.level, score: risk.score } : { level: 'UNKNOWN' },
      recent_vitals: vitals,
      generated_by: 'NexAI Clinical Engine',
      disclaimer: 'This is a decision support document, not a clinical diagnosis.'
    };

    const id = crypto.randomUUID();
    const title = `Health Report - Week ${profile?.pregnancy_week || 'N/A'}`;

    db.prepare(`
      INSERT INTO reports (id, user_id, title, content, verification_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, title, JSON.stringify(reportContent), verificationId);

    const saved = db.prepare('SELECT id, title, verification_id, created_at FROM reports WHERE id = ?').get(id);
    res.status(201).json(saved);

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ message: 'Server error generating report.' });
  }
});

// Get specific report details
router.get('/:id', (req, res) => {
  try {
    const report = db.prepare('SELECT * FROM reports WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.json({
      ...report,
      content: JSON.parse(report.content)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching report.' });
  }
});

module.exports = router;
