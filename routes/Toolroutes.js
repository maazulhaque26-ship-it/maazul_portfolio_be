// ============================================================
// backend/routes/toolRoutes.js
// ============================================================
// NEW: CRUD routes for the Favorite Tools section.
// ============================================================

const express = require('express');
const router  = express.Router();
const { getTools, createTool, updateTool, deleteTool } = require('../controllers/Toolcontroller');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTools)                    // Public — portfolio visitors
  .post(protectAdmin, createTool);  // Admin only

router.route('/:id')
  .put(protectAdmin, updateTool)    // Admin only
  .delete(protectAdmin, deleteTool); // Admin only

module.exports = router;