// ============================================================
// backend/controllers/profileController.js
// ============================================================
// UPDATED: Avatar images are now uploaded to Cloudinary via the
// uploadToCloudinary utility.  req.file.buffer (memoryStorage)
// is streamed directly — no ephemeral disk writes.
// ============================================================

const Profile = require('../models/Profile');
const { uploadToCloudinary } = require('../utils/cloudinary');

const safeParse = (data) => {
  if (typeof data !== 'string') return data;
  try { return JSON.parse(data); } catch { return undefined; }
};

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
    // Safely parse FormData JSON strings without crashing
    const hero     = safeParse(req.body.hero)     || req.body.hero;
    const about    = safeParse(req.body.about)    || req.body.about;
    const contact  = safeParse(req.body.contact)  || req.body.contact;
    const pricing  = safeParse(req.body.pricing)  || req.body.pricing;
    const timeline = safeParse(req.body.timeline) || req.body.timeline;
    const achievements = safeParse(req.body.achievements) || req.body.achievements;

    // If a new avatar was uploaded, stream it to Cloudinary
    if (req.file && hero) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'portfolio/avatars');
        hero.avatarUrl = result.secure_url;
      } catch (uploadObjError) {
        console.error('Cloudinary upload Error:', uploadObjError.message);
        return res.status(502).json({ message: 'Image upload failed. Please verify Cloudinary credentials.' });
      }
    }

    // Only include fields that were actually sent
    const updateData = {};
    if (hero && typeof hero === 'object')         updateData.hero     = hero;
    if (about && typeof about === 'object')        updateData.about    = about;
    if (contact && typeof contact === 'object')      updateData.contact  = contact;
    if (pricing && Array.isArray(pricing))      updateData.pricing  = pricing;
    if (timeline && Array.isArray(timeline))     updateData.timeline = timeline;
    if (achievements && Array.isArray(achievements)) updateData.achievements = achievements;

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