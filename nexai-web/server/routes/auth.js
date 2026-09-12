const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'diumed-dev-secret-change-in-production';

const generateToken = (user) => {
 return jwt.sign(
 { id: user.id, email: user.email, role: user.role },
 JWT_SECRET,
 { expiresIn: '7d' }
 );
};

// Register
router.post('/register', async (req, res) => {
 const { email, password } = req.body;

 if (!email || !password) {
 return res.status(400).json({ message: 'Email and password are required.' });
 }

 try {
 const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
 if (existingUser) {
 return res.status(409).json({ message: 'Email already exists.' });
 }

 const salt = await bcrypt.genSalt(12);
 const hash = await bcrypt.hash(password, salt);
 const id = crypto.randomUUID();

 db.prepare(`
 INSERT INTO users (id, email, password_hash) 
 VALUES (?, ?, ?)
 `).run(id, email, hash);

 const user = { id, email, role: 'patient' };
 const token = generateToken(user);

 res.status(201).json({ user, token });
 } catch (error) {
 console.error('Registration error:', error);
 res.status(500).json({ message: 'Server error during registration.' });
 }
});

// Login
router.post('/login', async (req, res) => {
 const { email, password } = req.body;

 if (!email || !password) {
 return res.status(400).json({ message: 'Email and password are required.' });
 }

 try {
 const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
 
 if (!user) {
 return res.status(401).json({ message: 'Invalid credentials.' });
 }

 const isMatch = await bcrypt.compare(password, user.password_hash);
 
 if (!isMatch) {
 return res.status(401).json({ message: 'Invalid credentials.' });
 }

 const userData = { id: user.id, email: user.email, role: user.role };
 const token = generateToken(userData);

 res.json({ user: userData, token });
 } catch (error) {
 console.error('Login error:', error);
 res.status(500).json({ message: 'Server error during login.' });
 }
});

// Get current user
router.get('/me', requireAuth, (req, res) => {
 try {
 const user = db.prepare('SELECT id, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
 if (!user) {
 return res.status(404).json({ message: 'User not found.' });
 }
 res.json({ user });
 } catch (error) {
 res.status(500).json({ message: 'Server error fetching profile.' });
 }
});

module.exports = router;
