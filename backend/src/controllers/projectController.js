const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, members = [] } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    const uniqueMembers = [...new Set([...members, req.user._id.toString()])];
    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: uniqueMembers
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { members: req.user._id };
  const projects = await Project.find(filter).populate('members', 'name email role').sort({ createdAt: -1 });
  res.json(projects);
};

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name email role');
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const allowed = req.user.role === 'admin' || project.members.some((m) => m._id.toString() === req.user._id.toString());
  if (!allowed) return res.status(403).json({ message: 'Forbidden' });

  res.json(project);
};
