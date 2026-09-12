const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');
const crypto = require('crypto');

// Public READ routes
router.get('/', (req, res) => {
  try {
    const organisers = db.prepare(`SELECT * FROM organisers WHERE status = 'active' ORDER BY display_order ASC, created_at ASC`).all();
    res.json(organisers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organisers' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const organiser = db.prepare(`SELECT * FROM organisers WHERE id = ?`).get(req.params.id);
    if (!organiser) return res.status(404).json({ error: 'Organiser not found' });
    res.json(organiser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organiser' });
  }
});

// Admin ONLY routes
const adminAuth = [requireAuth, requireRole('ADMIN')];

router.get('/admin/all', adminAuth, (req, res) => {
  try {
    const organisers = db.prepare(`SELECT * FROM organisers ORDER BY display_order ASC, created_at ASC`).all();
    res.json(organisers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organisers' });
  }
});

router.post('/', adminAuth, (req, res) => {
  try {
    const id = crypto.randomUUID();
    const { name, role, organization, description, image, contact_details, status, display_order } = req.body;
    
    db.prepare(`
      INSERT INTO organisers (id, name, role, organization, description, image, contact_details, status, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, role, organization, description, image, contact_details, status || 'active', display_order || 0);

    const newOrganiser = db.prepare(`SELECT * FROM organisers WHERE id = ?`).get(id);
    res.status(201).json(newOrganiser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organiser' });
  }
});

router.put('/:id', adminAuth, (req, res) => {
  try {
    const { name, role, organization, description, image, contact_details, status, display_order } = req.body;
    
    db.prepare(`
      UPDATE organisers 
      SET name = ?, role = ?, organization = ?, description = ?, image = ?, contact_details = ?, status = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, role, organization, description, image, contact_details, status, display_order, req.params.id);

    const updated = db.prepare(`SELECT * FROM organisers WHERE id = ?`).get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organiser' });
  }
});

router.delete('/:id', adminAuth, (req, res) => {
  try {
    db.prepare(`DELETE FROM organisers WHERE id = ?`).run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organiser' });
  }
});

module.exports = router;
