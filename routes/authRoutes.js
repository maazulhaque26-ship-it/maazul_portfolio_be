// ============================================================
// backend/routes/authRoutes.js
// ============================================================
// ADDED: GET /verify — protected route that validates the JWT.
//        Called by AuthContext on every page load to confirm
//        the stored token is still valid before showing dashboard.
// ============================================================

const express = require('express');
const router = express.Router();
const { loginUser, setupAdmin, verifyToken } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/setup', setupAdmin);
router.get('/verify', protectAdmin, verifyToken);  // NEW

module.exports = router;