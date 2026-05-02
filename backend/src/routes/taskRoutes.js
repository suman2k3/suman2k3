const express = require('express');
const { createTask, getTasksByProject, updateTask } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, adminOnly, createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:id', protect, updateTask);

module.exports = router;
