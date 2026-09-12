const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');
const crypto = require('crypto');

// Public READ routes
router.get('/', (req, res) => {
  try {
    const domains = db.prepare(`SELECT * FROM domains WHERE status = 'published' ORDER BY display_order ASC, created_at DESC`).all();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

router.get('/:slug', (req, res) => {
  try {
    const domain = db.prepare(`SELECT * FROM domains WHERE slug = ?`).get(req.params.slug);
    if (!domain) return res.status(404).json({ error: 'Domain not found' });
    res.json(domain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domain' });
  }
});

// Admin ONLY routes
const adminAuth = [requireAuth, requireRole('ADMIN')];

router.get('/admin/all', adminAuth, (req, res) => {
  try {
    const domains = db.prepare(`SELECT * FROM domains ORDER BY display_order ASC, created_at DESC`).all();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

router.post('/', adminAuth, (req, res) => {
  try {
    const id = crypto.randomUUID();
    const { title, description, category, image, slug, status, featured, display_order } = req.body;
    
    db.prepare(`
      INSERT INTO domains (id, title, description, category, image, slug, status, featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description, category, image, slug || id, status || 'draft', featured ? 1 : 0, display_order || 0);

    const newDomain = db.prepare(`SELECT * FROM domains WHERE id = ?`).get(id);
    res.status(201).json(newDomain);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create domain' });
  }
});

router.put('/:id', adminAuth, (req, res) => {
  try {
    const { title, description, category, image, slug, status, featured, display_order } = req.body;
    
    db.prepare(`
      UPDATE domains 
      SET title = ?, description = ?, category = ?, image = ?, slug = ?, status = ?, featured = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, category, image, slug, status, featured ? 1 : 0, display_order, req.params.id);

    const updated = db.prepare(`SELECT * FROM domains WHERE id = ?`).get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update domain' });
  }
});

router.delete('/:id', adminAuth, (req, res) => {
  try {
    db.prepare(`DELETE FROM domains WHERE id = ?`).run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete domain' });
  }
});

module.exports = router;
