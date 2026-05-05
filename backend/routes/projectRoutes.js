const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, addMember } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject); // Only admin can create projects

router.route('/:id')
  .get(protect, getProjectById);

router.route('/:id/members')
  .put(protect, admin, addMember); // Only admin can add members

module.exports = router;
