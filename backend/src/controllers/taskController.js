const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const { title, description, status, assignedTo, projectId, dueDate } = req.body;
  if (!title || !assignedTo || !projectId || !dueDate) {
    return res.status(400).json({ message: 'title, assignedTo, projectId, dueDate are required' });
  }

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const isMember = project.members.some((m) => m.toString() === assignedTo);
  if (!isMember) return res.status(400).json({ message: 'Assignee must be a project member' });

  const task = await Task.create({ title, description, status, assignedTo, projectId, dueDate });
  res.status(201).json(task);
};

exports.getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId })
    .populate('assignedTo', 'name email')
    .sort({ dueDate: 1 });

  const filtered = req.user.role === 'admin' ? tasks : tasks.filter((t) => t.assignedTo._id.toString() === req.user._id.toString());
  res.json(filtered);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only update your own tasks' });
  }

  const updates = ['title', 'description', 'status', 'assignedTo', 'dueDate'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  await task.save();
  res.json(task);
};
