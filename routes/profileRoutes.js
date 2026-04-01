const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // ✅ ADDED

router.route('/')
  .get(getProfile)
  .put(protectAdmin, upload.single('avatarImage'), updateProfile); // ✅ UPDATED

module.exports = router;