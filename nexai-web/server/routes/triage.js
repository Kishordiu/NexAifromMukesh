const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

router.post('/', async (req, res) => {
<<<<<<< HEAD
  const { text, language = 'en' } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Triage input text is required.' });
  }

  const id = crypto.randomUUID();

  // If no API key is provided, return a mock response indicating unavailability
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your-key-here') {
    const mockResponse = {
      symptoms: ["Unknown (Service unavailable)"],
      possible_concerns: ["AI Triage service is currently not configured."],
      urgency_level: "UNAVAILABLE",
      what_to_do_now: "Please contact your ASHA worker or healthcare provider directly.",
      what_to_monitor: "Monitor your general well-being.",
      when_to_seek_care: "If you experience any severe symptoms like bleeding, severe abdominal pain, or difficulty breathing, seek immediate medical attention.",
      red_flags: []
    };
    
    try {
      db.prepare(`
        INSERT INTO symptom_sessions (id, user_id, transcript, language, triage_response, urgency)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, req.user.id, text, language, JSON.stringify(mockResponse), 'UNAVAILABLE');
      
      return res.json(mockResponse);
    } catch (err) {
      return res.status(500).json({ message: 'Database error saving mock session.' });
    }
  }

  // Real DeepSeek API Call
  try {
    const systemPrompt = `
      You are a clinical decision support assistant for maternal health in rural/low-resource settings.
      Analyze the provided symptoms and return a JSON object with EXACTLY these keys:
      - symptoms: array of strings (the extracted symptoms)
      - possible_concerns: array of strings (potential medical issues)
      - urgency_level: exactly one of: "NORMAL", "MONITOR", "CONTACT_CLINICIAN", "URGENT", "EMERGENCY"
      - what_to_do_now: string (immediate actionable advice)
      - what_to_monitor: string (what the patient should watch out for)
      - when_to_seek_care: string (specific triggers for escalation)
      - red_flags: array of strings (danger signs present or to watch for)
      
      Language requested: ${language}. Ensure the response text (values) is in this language, but keep JSON keys in English.
      IMPORTANT: You are a decision support tool, not a definitive diagnostician. Err on the side of safety.
      Output ONLY valid JSON.
    `;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // using chat model for structured JSON extraction
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1 // Low temperature for deterministic clinical output
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API Error:', errText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const triageResult = JSON.parse(data.choices[0].message.content);
    
    // Save to database
    db.prepare(`
      INSERT INTO symptom_sessions (id, user_id, transcript, language, extracted_symptoms, triage_response, urgency)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, 
      req.user.id, 
      text, 
      language, 
      JSON.stringify(triageResult.symptoms || []), 
      JSON.stringify(triageResult), 
      triageResult.urgency_level || 'UNKNOWN'
    );

    res.json(triageResult);
  } catch (error) {
    console.error('Triage error:', error);
    res.status(500).json({ message: 'Error processing triage request.' });
  }
=======
 const { text, language = 'en' } = req.body;
 
 if (!text) {
 return res.status(400).json({ message: 'Triage input text is required.' });
 }

 const id = crypto.randomUUID();

 // If no API key is provided, return a mock response indicating unavailability
 if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your-key-here') {
 const mockResponse = {
 symptoms: ["Unknown (Service unavailable)"],
 possible_concerns: ["AI Triage service is currently not configured."],
 urgency_level: "UNAVAILABLE",
 what_to_do_now: "Please contact your ASHA worker or healthcare provider directly.",
 what_to_monitor: "Monitor your general well-being.",
 when_to_seek_care: "If you experience any severe symptoms like bleeding, severe abdominal pain, or difficulty breathing, seek immediate medical attention.",
 red_flags: []
 };
 
 try {
 db.prepare(`
 INSERT INTO symptom_sessions (id, user_id, transcript, language, triage_response, urgency)
 VALUES (?, ?, ?, ?, ?, ?)
 `).run(id, req.user.id, text, language, JSON.stringify(mockResponse), 'UNAVAILABLE');
 
 return res.json(mockResponse);
 } catch (err) {
 return res.status(500).json({ message: 'Database error saving mock session.' });
 }
 }

 // Real DeepSeek API Call
 try {
 const systemPrompt = `
 You are a clinical decision support assistant for maternal health in rural/low-resource settings.
 Analyze the provided symptoms and return a JSON object with EXACTLY these keys:
 - symptoms: array of strings (the extracted symptoms)
 - possible_concerns: array of strings (potential medical issues)
 - urgency_level: exactly one of: "NORMAL", "MONITOR", "CONTACT_CLINICIAN", "URGENT", "EMERGENCY"
 - what_to_do_now: string (immediate actionable advice)
 - what_to_monitor: string (what the patient should watch out for)
 - when_to_seek_care: string (specific triggers for escalation)
 - red_flags: array of strings (danger signs present or to watch for)
 
 Language requested: ${language}. Ensure the response text (values) is in this language, but keep JSON keys in English.
 IMPORTANT: You are a decision support tool, not a definitive diagnostician. Err on the side of safety.
 Output ONLY valid JSON.
 `;

 const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
 },
 body: JSON.stringify({
 model: 'deepseek-chat', // using chat model for structured JSON extraction
 messages: [
 { role: 'system', content: systemPrompt },
 { role: 'user', content: text }
 ],
 response_format: { type: 'json_object' },
 temperature: 0.1 // Low temperature for deterministic clinical output
 })
 });

 if (!response.ok) {
 const errText = await response.text();
 console.error('DeepSeek API Error:', errText);
 throw new Error(`API Error: ${response.status}`);
 }

 const data = await response.json();
 const triageResult = JSON.parse(data.choices[0].message.content);
 
 // Save to database
 db.prepare(`
 INSERT INTO symptom_sessions (id, user_id, transcript, language, extracted_symptoms, triage_response, urgency)
 VALUES (?, ?, ?, ?, ?, ?, ?)
 `).run(
 id, 
 req.user.id, 
 text, 
 language, 
 JSON.stringify(triageResult.symptoms || []), 
 JSON.stringify(triageResult), 
 triageResult.urgency_level || 'UNKNOWN'
 );

 res.json(triageResult);
 } catch (error) {
 console.error('Triage error:', error);
 res.status(500).json({ message: 'Error processing triage request.' });
 }
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
});

module.exports = router;
