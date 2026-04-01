// ============================================================
// backend/models/Footer.js
// ============================================================
// NEW: Stores footer content — brand name, tagline, copyright
//      text, and social links. Uses a singleton pattern
//      (only one footer document in the collection).
// ============================================================

const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema(
  {
    brandName:     { type: String, default: 'Olivia' },
    tagline:       { type: String, default: '' },
    copyrightText: { type: String, default: '© 2025 Olivia Smith. All rights reserved.' },
    socials: {
      linkedin:  { type: String, default: '' },
      twitter:   { type: String, default: '' },
      dribbble:  { type: String, default: '' },
      github:    { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Footer', footerSchema);