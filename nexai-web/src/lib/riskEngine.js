/**
 * DiuMed Risk Engine
 * Evaluates patient measurements and triage data to determine an overall health risk level.
 * 
 * NOTE: This is a -grade heuristic engine.
 */

export const RiskLevels = {
 LOW: 'LOW',
 MODERATE: 'MODERATE',
 HIGH: 'HIGH',
 CRITICAL: 'CRITICAL'
};

export function evaluateRisk(measurements = [], triageHistory = []) {
 let riskScore = 0;
 const factors = [];

 // Group latest measurements by type
 const latest = {};
 measurements.forEach(m => {
 if (!latest[m.type] || new Date(m.created_at) > new Date(latest[m.type].created_at)) {
 latest[m.type] = m;
 }
 });

 // Evaluate Blood Pressure
 if (latest.blood_pressure) {
 const [sys, dia] = latest.blood_pressure.value.split('/').map(Number);
 if (sys >= 160 || dia >= 110) {
 riskScore += 3;
 factors.push('Critical Hypertension (Preeclampsia risk)');
 } else if (sys >= 140 || dia >= 90) {
 riskScore += 2;
 factors.push('High Blood Pressure');
 } else if (sys >= 130 || dia >= 85) {
 riskScore += 1;
 factors.push('Elevated Blood Pressure');
 }
 }

 // Evaluate Heart Rate
 if (latest.heart_rate) {
 const bpm = Number(latest.heart_rate.value);
 if (bpm > 120) {
 riskScore += 2;
 factors.push('Tachycardia (High Heart Rate)');
 } else if (bpm > 100) {
 riskScore += 1;
 factors.push('Elevated Heart Rate');
 }
 }

 // Evaluate Hemoglobin (OCR)
 if (latest.hemoglobin) {
 const hgb = Number(latest.hemoglobin.value);
 if (hgb < 9.0) {
 riskScore += 3;
 factors.push('Severe Anemia');
 } else if (hgb < 11.0) {
 riskScore += 1;
 factors.push('Mild/Moderate Anemia');
 }
 }

 // Evaluate Vision Modules
 if (latest.anemia_risk) {
 if (latest.anemia_risk.metadata?.rawResult === 'SEVERE_PALLOR') {
 riskScore += 2;
 factors.push('Visible Severe Conjunctival Pallor');
 } else if (latest.anemia_risk.metadata?.rawResult === 'MILD_PALLOR') {
 riskScore += 1;
 factors.push('Visible Mild Conjunctival Pallor');
 }
 }

 if (latest.jaundice_risk) {
 if (latest.jaundice_risk.metadata?.rawResult === 'ELEVATED_BILIRUBIN') {
 riskScore += 2;
 factors.push('Visible Scleral Icterus (Jaundice)');
 }
 }

 // Evaluate Triage
 const latestTriage = triageHistory[0];
 if (latestTriage) {
 if (latestTriage.urgency === 'CRITICAL') {
 riskScore += 4;
 factors.push('Critical Symptoms Reported');
 } else if (latestTriage.urgency === 'HIGH') {
 riskScore += 2;
 factors.push('High-Risk Symptoms Reported');
 } else if (latestTriage.urgency === 'MEDIUM') {
 riskScore += 1;
 factors.push('Moderate Symptoms Reported');
 }
 }

 // Determine Overall Level
 let level = RiskLevels.LOW;
 if (riskScore >= 4) level = RiskLevels.CRITICAL;
 else if (riskScore >= 2) level = RiskLevels.HIGH;
 else if (riskScore >= 1) level = RiskLevels.MODERATE;

 return {
 level,
 score: riskScore,
 factors,
 timestamp: new Date().toISOString()
 };
}
