// ============================================================
// backend/controllers/profileController.js
// ============================================================
// UPDATED: Avatar images are now uploaded to Cloudinary via the
// uploadToCloudinary utility.  req.file.buffer (memoryStorage)
// is streamed directly — no ephemeral disk writes.
// ============================================================

const Profile = require('../models/Profile');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.status(200).json(profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // FormData sends nested objects as JSON strings — parse them
    const hero     = typeof req.body.hero     === 'string' ? JSON.parse(req.body.hero)     : req.body.hero;
    const about    = typeof req.body.about    === 'string' ? JSON.parse(req.body.about)    : req.body.about;
    const contact  = typeof req.body.contact  === 'string' ? JSON.parse(req.body.contact)  : req.body.contact;
    const pricing  = typeof req.body.pricing  === 'string' ? JSON.parse(req.body.pricing)  : req.body.pricing;
    const timeline = typeof req.body.timeline === 'string' ? JSON.parse(req.body.timeline) : req.body.timeline;

    // If a new avatar was uploaded, stream it to Cloudinary
    if (req.file && hero) {
      const result = await uploadToCloudinary(req.file.buffer, 'portfolio/avatars');
      hero.avatarUrl = result.secure_url;
    }

    // Only include fields that were actually sent
    const updateData = {};
    if (hero)     updateData.hero     = hero;
    if (about)    updateData.about    = about;
    if (contact)  updateData.contact  = contact;
    if (pricing)  updateData.pricing  = pricing;
    if (timeline) updateData.timeline = timeline;

    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
};