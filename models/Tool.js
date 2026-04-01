// ============================================================
// backend/models/Tool.js
// ============================================================
// NEW: Mongoose model for the "Favorite Tools" section.
//      Supports name, icon label, percentage, and optional
//      image URL for custom tool icons.
// ============================================================

const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema(
  {
    name:       { type: String, required: [true, 'Tool name is required'], trim: true },
    icon:       { type: String, default: '✦' },    // Short text icon (e.g. "F", "Ai", "Id")
    percentage: { type: String, default: '90%' },   // Proficiency display string
    imageUrl:   { type: String, default: '' },       // Optional: uploaded icon image
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tool', toolSchema);