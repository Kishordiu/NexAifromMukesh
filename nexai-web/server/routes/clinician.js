const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// Note: In a real app, verify the user has a CLINICIAN role.
// For the hackathon, we'll allow authenticated access for demo purposes.

router.get('/patients', requireAuth, (req, res) => {
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
        SELECT risk_level, score FROM risk_assessments 
        WHERE patient_id = ? ORDER BY created_at DESC LIMIT 1
      `).get(p.id);
      
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

router.post('/verify-report/:id', requireAuth, (req, res) => {
  try {
    // We just mock the clinician name for demo
    const clinicianName = "Dr. Sarah Jenkins";
    
    db.prepare(`
      UPDATE clinical_reports 
      SET verified_by = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(clinicianName, req.params.id);

    res.json({ success: true, verified_by: clinicianName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify report' });
  }
});

module.exports = router;
