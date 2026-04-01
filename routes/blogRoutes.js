const express = require('express');
const router = express.Router();
const { getBlogs, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protectAdmin, createBlog);

router.route('/:id')
  .put(protectAdmin, updateBlog)
  .delete(protectAdmin, deleteBlog);

module.exports = router;
