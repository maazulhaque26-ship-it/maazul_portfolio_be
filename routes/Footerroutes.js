// ============================================================
// backend/routes/footerRoutes.js
// ============================================================
// NEW: Routes for dynamic footer management.
// ============================================================

const express = require('express');
const router  = express.Router();
const { getFooter, updateFooter } = require('../controllers/Footercontroller');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFooter)                    // Public — rendered on portfolio site
  .put(protectAdmin, updateFooter);  // Admin only

module.exports = router;