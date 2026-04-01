// ============================================================
// backend/controllers/toolController.js
// ============================================================
// NEW: Full CRUD for the "Favorite Tools" section.
// ============================================================

const Tool = require('../models/Tool');

// GET /api/tools — Public
const getTools = async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: 1 });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tools — Admin
const createTool = async (req, res) => {
  try {
    const { name, icon, percentage, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tool name is required' });
    }

    const tool = await Tool.create({
      name,
      icon:       icon       || '✦',
      percentage: percentage || '90%',
      imageUrl:   imageUrl   || '',
    });

    res.status(201).json(tool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/tools/:id — Admin
const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });

    const { name, icon, percentage, imageUrl } = req.body;

    if (name       !== undefined) tool.name       = name;
    if (icon       !== undefined) tool.icon       = icon;
    if (percentage !== undefined) tool.percentage = percentage;
    if (imageUrl   !== undefined) tool.imageUrl   = imageUrl;

    const updated = await tool.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/tools/:id — Admin
const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    await tool.deleteOne();
    res.json({ message: 'Tool removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTools, createTool, updateTool, deleteTool };