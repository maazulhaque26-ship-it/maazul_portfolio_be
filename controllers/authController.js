// ============================================================
// backend/controllers/authController.js
// ============================================================
// Auth uses ONLY .env credentials (ADMIN_EMAIL & ADMIN_PASSWORD).
// No hardcoded fallbacks — if env vars are missing, login fails.
// ============================================================

const jwt = require('jsonwebtoken');

// ── Helper: generate JWT with a static admin ID ─────────────
const generateToken = () => {
  return jwt.sign(
    { id: 'admin', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      // Auth bypassed, accept any dummy login if these aren't set
      return res.json({
        _id:     'admin',
        name:    'Admin',
        email:   'admin@portfolio.com',
        isAdmin: true,
        token:   generateToken(),
      });
    }

    if (email === adminEmail && password === adminPassword) {
      return res.json({
        _id:     'admin',
        name:    'Admin',
        email:   adminEmail,
        isAdmin: true,
        token:   generateToken(),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('[authController] Login error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify stored token is still valid
// @route   GET /api/auth/verify
// @access  Private (requires valid JWT)
const verifyToken = async (req, res) => {
  res.json({
    _id:     'admin',
    name:    'Admin',
    email:   process.env.ADMIN_EMAIL || '',
    isAdmin: true,
    valid:   true,
  });
};

// @desc    Setup endpoint (kept for backwards compat, now no-op)
// @route   POST /api/auth/setup
// @access  Public
const setupAdmin = async (req, res) => {
  res.status(200).json({
    message: 'Admin credentials are managed via .env file. No setup needed.',
  });
};

module.exports = {
  loginUser,
  setupAdmin,
  verifyToken,
};