// ============================================================
// backend/controllers/projectController.js
// ============================================================
// FIX: The old Project.js model was actually exporting "Profile",
//      so this controller was operating on the wrong collection.
//      Now that Project.js is fixed, this works correctly.
// ============================================================

const Project = require('../models/Project');

// GET /api/projects — Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects — Admin
const createProject = async (req, res) => {
  try {
    const { title, description, technologies, imageUrl, githubUrl, liveViewUrl, isFeatured } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: 'title, description and imageUrl are required' });
    }

    const project = await Project.create({
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      imageUrl,
      githubUrl:   githubUrl   || '',
      liveViewUrl: liveViewUrl || '',
      isFeatured:  isFeatured  || false,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/projects/:id — Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, technologies, imageUrl, githubUrl, liveViewUrl, isFeatured } = req.body;

    if (title)        project.title        = title;
    if (description)  project.description  = description;
    if (technologies) project.technologies = technologies;
    if (imageUrl)     project.imageUrl     = imageUrl;
    if (githubUrl   !== undefined) project.githubUrl   = githubUrl;
    if (liveViewUrl !== undefined) project.liveViewUrl = liveViewUrl;
    if (isFeatured  !== undefined) project.isFeatured  = isFeatured;

    const updated = await project.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/projects/:id — Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };