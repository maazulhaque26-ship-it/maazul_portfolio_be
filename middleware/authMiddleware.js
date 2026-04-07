// ============================================================
// backend/middleware/authMiddleware.js
// ============================================================
// JWT-based admin auth. Verifies JWT from Authorization header.
// Token payload: { id: 'admin', role: 'admin' }
// ============================================================

const jwt = require('jsonwebtoken');

exports.protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      _id:     decoded.id   || 'admin',
      role:    decoded.role || 'admin',
      name:    'Admin',
      email:   process.env.ADMIN_EMAIL || '',
      isAdmin: true,
    };

    next();
  } catch (error) {
    console.error('[authMiddleware] Token verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized — token invalid or expired' });
  }
};