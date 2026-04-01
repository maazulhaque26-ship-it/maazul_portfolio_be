// ============================================================
// backend/models/Project.js
// ============================================================
// FIX: This file previously exported a "Profile" model instead
//      of a "Project" model, causing a Mongoose OverwriteModel
//      error and crashing all CRUD operations on /api/projects.
// ============================================================

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:        { type: String, required: [true, 'Project title is required'], trim: true },
    description:  { type: String, required: [true, 'Project description is required'] },
    technologies: [{ type: String }],                       // e.g. ["React", "Node.js", "MongoDB"]
    imageUrl:     { type: String, required: [true, 'Project image is required'] },
    githubUrl:    { type: String, default: '' },
    liveViewUrl:  { type: String, default: '' },
    isFeatured:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);