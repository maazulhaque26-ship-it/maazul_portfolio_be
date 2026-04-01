const mongoose = require('mongoose');

const marqueeSchema = new mongoose.Schema({
  items: {
    type: [String],
    default: ['App Design', 'Website Design', 'Dashboard', 'Wireframe', 'UI/UX Design'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Marquee', marqueeSchema);
