const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', protectAdmin, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ url: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'No image uploaded' });
  }
});

module.exports = router; // ✅ FIXED