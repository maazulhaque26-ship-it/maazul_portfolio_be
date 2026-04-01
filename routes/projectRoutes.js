const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(protectAdmin, createProject);

router.route('/:id')
  .put(protectAdmin, updateProject)
  .delete(protectAdmin, deleteProject);

module.exports = router;
