const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

// Clinical records are restricted to server-provisioned clinician accounts.

router.get('/patients', requireAuth, requireRole('clinician'), (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT p.*, u.email 
      FROM patient_profiles p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.updated_at DESC
    `).all();
    
    // Attach latest risk for each
    const enriched = patients.map(p => {
      const latestRisk = db.prepare(`
        SELECT level AS risk_level, score FROM risk_assessments
        WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
      `).get(p.user_id);
      
      return {
        ...p,
        risk: latestRisk || { risk_level: 'UNKNOWN', score: 0 }
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error('Clinician error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

router.post('/verify-report/:id', requireAuth, requireRole('clinician'), (req, res) => {
  try {
    const result = db.prepare(
      'UPDATE lab_reports SET verified = 1 WHERE id = ?'
    ).run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Lab report not found.' });
    }

    res.json({ success: true, verified_by: req.user.email });
  } catch (error) {
    console.error('Report verification error:', error);
    res.status(500).json({ error: 'Failed to verify report.' });
  }
});

module.exports = router;
