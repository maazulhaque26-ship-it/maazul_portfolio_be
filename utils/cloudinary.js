// ============================================================
// backend/utils/cloudinary.js
// ============================================================
// Cloudinary configuration + stream-based upload utility.
// Uses streamifier to pipe multer's in-memory buffer directly
// to Cloudinary — no disk writes, no ephemeral FS issues.
// ============================================================

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param {Buffer}  fileBuffer  - The file buffer from multer memoryStorage
 * @param {string}  folder      - Cloudinary folder name (e.g. "portfolio")
 * @returns {Promise<object>}   - Cloudinary upload result (contains secure_url)
 */
const uploadToCloudinary = (fileBuffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',       // auto-detect image/video/raw
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },  // optimise delivery
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Pipe the buffer into the upload stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
