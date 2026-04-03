// ============================================================
// backend/routes/uploadRoutes.js
// ============================================================
// CHANGED: Instead of returning a local /uploads/... path,
// the file buffer is now uploaded to Cloudinary and the
// secure_url is returned to the client.
// ============================================================

const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { protectAdmin } = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../utils/cloudinary');

router.post('/', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Upload the in-memory buffer directly to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/uploads');

    // Return the permanent cloud URL
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(502).json({ message: 'Image upload failed. Please verify Cloudinary credentials.', error: error.message });
  }
});

module.exports = router;