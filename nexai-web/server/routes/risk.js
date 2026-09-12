const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.post('/assess', (req, res) => {
 const userId = req.user.id;

 try {
 // 1. Gather all data
 const profile = db.prepare('SELECT * FROM patient_profiles WHERE user_id = ?').get(userId);
 
 // Get latest vitals
 const hrMeasurement = db.prepare('SELECT * FROM measurements WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1').get(userId, 'heart_rate');
 const anemiaScan = db.prepare('SELECT * FROM vision_scans WHERE user_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1').get(userId, 'anemia');
 
 // Get recent severe symptoms (last 24 hours)
 const recentSymptoms = db.prepare(`
 SELECT * FROM symptom_sessions 
 WHERE user_id = ? 
 AND created_at >= datetime('now', '-1 day')
 ORDER BY created_at DESC LIMIT 5
 `).all(userId);

 // 2. Risk Calculation Engine
 let score = 0;
 const factors = [];
 const reasons = [];
 const recommendations = [];
 let isCritical = false;
 let isElevated = false;

 // A. Profile Risks
 if (profile) {
 if (profile.pregnancy_week > 37) {
 factors.push('Term Pregnancy');
 reasons.push('Patient is at term (>37 weeks).');
 }
 if (profile.age > 35) {
 score += 1;
 factors.push('Advanced Maternal Age');
 }
 if (profile.conditions && profile.conditions.toLowerCase().includes('hypertension')) {
 score += 3;
 factors.push('History of Hypertension');
 reasons.push('Pre-existing hypertensive condition.');
 isElevated = true;
 }
 }

 // B. Vitals Risks
 if (hrMeasurement && hrMeasurement.value) {
 const hr = hrMeasurement.value;
 if (hr > 110) {
 score += 3;
 factors.push('Tachycardia');
 reasons.push(`Elevated resting heart rate (${hr} BPM).`);
 isElevated = true;
 } else if (hr < 50) {
 score += 2;
 factors.push('Bradycardia');
 reasons.push(`Low resting heart rate (${hr} BPM).`);
 }
 }

 if (anemiaScan && anemiaScan.result === 'ELEVATED_RISK') {
 score += 2;
 factors.push('Possible Anemia');
 reasons.push('Conjunctival pallor detected in recent vision scan.');
 recommendations.push('Schedule hemoglobin blood test to confirm anemia status.');
 }

 // C. Triage/Symptom Risks
 const hasEmergency = recentSymptoms.some(s => s.urgency === 'EMERGENCY' || s.urgency === 'URGENT');
 if (hasEmergency) {
 score += 10;
 isCritical = true;
 factors.push('Severe Symptoms Reported');
 reasons.push('Recent AI triage flagged urgent/emergency symptoms.');
 recommendations.push('Immediate clinical evaluation required.');
 }

 // 3. Determine Level
 let level = 'LOW';
 if (isCritical || score >= 8) {
 level = 'CRITICAL';
 } else if (isElevated || score >= 5) {
 level = 'HIGH';
 } else if (score >= 3) {
 level = 'ELEVATED';
 } else if (score >= 1) {
 level = 'MODERATE';
 }

 if (level === 'LOW') {
 recommendations.push('Continue routine antenatal care.');
 }

 const assessment = {
 level,
 score,
 factors,
 reasons,
 recommendations
 };

 // 4. Save to Database
 const id = crypto.randomUUID();
 db.prepare(`
 INSERT INTO risk_assessments (id, user_id, level, score, factors, reasons, recommendations)
 VALUES (?, ?, ?, ?, ?, ?, ?)
 `).run(
 id, 
 userId, 
 level, 
 score, 
 JSON.stringify(factors), 
 JSON.stringify(reasons), 
 JSON.stringify(recommendations)
 );

 const saved = db.prepare('SELECT * FROM risk_assessments WHERE id = ?').get(id);
 res.json({
 ...saved,
 factors: JSON.parse(saved.factors),
 reasons: JSON.parse(saved.reasons),
 recommendations: JSON.parse(saved.recommendations)
 });

 } catch (error) {
 console.error('Risk engine error:', error);
 res.status(500).json({ message: 'Server error processing risk assessment.' });
 }
});

module.exports = router;
