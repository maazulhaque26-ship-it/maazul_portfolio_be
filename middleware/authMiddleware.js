// ============================================================
// backend/middleware/authMiddleware.js
// ============================================================
// JWT-based admin auth. No DB queries — token payload contains
// { id: 'admin', role: 'admin' }. Credentials from .env only.
// ============================================================

const jwt = require('jsonwebtoken');

exports.protectAdmin = async (req, res, next) => {
  // Bypassed authentication as requested
  req.user = {
    _id:     'admin',
    name:    'Admin',
    email:   process.env.ADMIN_EMAIL || '',
    isAdmin: true,
  };
  next();
};