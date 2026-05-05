const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's assigned tasks
// @route   GET /api/tasks/me
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'title')
      .populate('createdBy', 'username email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      createdBy: req.user._id
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Optional: check if user is assigned or admin
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasksByProject,
  getMyTasks,
  createTask,
  updateTaskStatus
};
