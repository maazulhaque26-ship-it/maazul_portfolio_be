// ============================================================
// backend/controllers/footerController.js
// ============================================================
// NEW: Singleton CRUD for footer content. Only one footer
//      document exists — getFooter returns it, updateFooter
//      upserts it.
// ============================================================

const Footer = require('../models/Footer');

// GET /api/footer — Public
const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    // Auto-create default footer if none exists
    if (!footer) {
      footer = await Footer.create({});
    }

    res.json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/footer — Admin
const updateFooter = async (req, res) => {
  try {
    const { brandName, tagline, copyrightText, socials } = req.body;

    const updateData = {};
    if (brandName     !== undefined) updateData.brandName     = brandName;
    if (tagline       !== undefined) updateData.tagline       = tagline;
    if (copyrightText !== undefined) updateData.copyrightText = copyrightText;
    if (socials       !== undefined) updateData.socials       = socials;

    const footer = await Footer.findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(footer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getFooter, updateFooter };