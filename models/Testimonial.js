const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: [true, 'Client name is required'] },
    role:       { type: String, required: [true, 'Role / company is required'] },
    text:       { type: String, required: [true, 'Review text is required'] },
    rating:     { type: Number, default: 5, min: 1, max: 5 },
    imageUrl:   { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);