const Blog = require('../models/Blog');

// GET /api/blogs  — Public
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/blogs  — Admin
const createBlog = async (req, res) => {
  try {
    const { title, content, imageUrl, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }
    const blog = await Blog.create({ title, content, imageUrl: imageUrl || '', category: category || 'General' });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/blogs/:id  — Admin
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/blogs/:id  — Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };