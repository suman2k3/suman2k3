const express = require('express');
const { createProject, getProjects, getProjectById } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, adminOnly, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);

module.exports = router;
