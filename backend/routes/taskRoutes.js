const express = require('express');
const router = express.Router();
const { getTasksByProject, getMyTasks, createTask, updateTaskStatus } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyTasks);
router.get('/project/:projectId', protect, getTasksByProject);
router.post('/', protect, createTask);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
