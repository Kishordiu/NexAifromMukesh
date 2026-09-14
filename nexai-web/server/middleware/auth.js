const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
<<<<<<< HEAD
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'nexai-dev-secret-change-in-production'
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
=======
 const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith('Bearer ')) {
 return res.status(401).json({ message: 'Authentication required. No token provided.' });
 }

 const token = authHeader.split(' ')[1];

 try {
 const decoded = jwt.verify(
 token,
 process.env.JWT_SECRET || 'diumed-dev-secret-change-in-production'
 );
 req.user = decoded;
 next();
 } catch (error) {
 return res.status(401).json({ message: 'Invalid or expired token.' });
 }
};

const requireRole = (role) => {
 return (req, res, next) => {
 if (!req.user || req.user.role !== role) {
 return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
 }
 next();
 };
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
};

module.exports = { requireAuth, requireRole };
