const express = require('express');
const router  = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTestimonials)
  .post(protectAdmin, createTestimonial);

router.route('/:id')
  .put(protectAdmin, updateTestimonial)
  .delete(protectAdmin, deleteTestimonial);

module.exports = router;