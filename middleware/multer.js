// ============================================================
// backend/middleware/multer.js
// ============================================================
// CHANGED: diskStorage ➜ memoryStorage
//
// Files are now kept as an in-memory Buffer (req.file.buffer)
// and piped directly to Cloudinary by the controller/route.
// This completely bypasses Vercel/Render's ephemeral disk.
// ============================================================

const multer = require('multer');
const path = require('path');

// In-memory storage — no disk writes
const storage = multer.memoryStorage();

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|gif|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
