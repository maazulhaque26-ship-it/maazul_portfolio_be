const Testimonial = require('../models/Testimonial');

// GET /api/testimonials  — Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/testimonials  — Admin
// Accepts both naming conventions:
//   Admin panel sends: { name, company, text, rating, imageUrl }
//   Model stores:      { clientName, role, text, rating, imageUrl }
const createTestimonial = async (req, res) => {
  try {
    const { name, clientName, company, role, text, rating, imageUrl } = req.body;
    const resolvedName = clientName || name;
    const resolvedRole = role || company;

    if (!resolvedName || !resolvedRole || !text) {
      return res.status(400).json({ message: 'name, company/role and text are required' });
    }
    const testimonial = await Testimonial.create({
      clientName: resolvedName,
      role:       resolvedRole,
      text,
      rating:   rating   || 5,
      imageUrl: imageUrl || '',
    });
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/testimonials/:id  — Admin
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });

    const { name, clientName, company, role, text, rating, imageUrl } = req.body;
    if (clientName || name)    testimonial.clientName = clientName || name;
    if (role || company)       testimonial.role       = role || company;
    if (text)                  testimonial.text       = text;
    if (rating  !== undefined) testimonial.rating     = rating;
    if (imageUrl !== undefined) testimonial.imageUrl  = imageUrl;

    const updated = await testimonial.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/testimonials/:id  — Admin
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    await testimonial.deleteOne();
    res.json({ message: 'Testimonial removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };