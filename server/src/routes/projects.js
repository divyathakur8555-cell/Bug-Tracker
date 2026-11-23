
import { Router } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

// Get all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.userId },
        { teamMembers: req.userId }
      ]
    })
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email')
      .sort('-updatedAt');

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Create project
router.post('/', async (req, res, next) => {
  try {
    const title = req.body?.title?.trim();
    const description = req.body?.description?.trim() || '';

    if (!title) {
      return res.status(400).json({
        message: 'Project title is required'
      });
    }

    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(401).json({
        message: 'Invalid user authentication'
      });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.userId,
      teamMembers: [req.userId]
    });

    await project.populate('owner teamMembers', 'name email');

    return res.status(201).json(project);
  } catch (error) {
    console.error('PROJECT CREATION ERROR:', error);
    next(error);
  }
});

// Get one project
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project id'
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.userId },
        { teamMembers: req.userId }
      ]
    })
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Update project
router.patch('/:id', async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found or you are not the owner'
      });
    }

    if (req.body.title !== undefined) {
      project.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      project.description = req.body.description;
    }

    await project.save();

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Add project member
router.post('/:id/members', async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found or you are not the owner'
      });
    }

    const member = await User.findOne({
      email: req.body.email?.toLowerCase()
    });

    if (!member) {
      return res.status(404).json({
        message: 'No user found with that email'
      });
    }

    if (!project.teamMembers.some(id => id.equals(member._id))) {
      project.teamMembers.push(member._id);
    }

    await project.save();

    res.json(
      await project.populate('teamMembers', 'name email')
    );
  } catch (error) {
    next(error);
  }
});

// Delete project and its tickets
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project id'
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.userId
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found or you are not the owner'
      });
    }

    await Ticket.deleteMany({
      project: project._id
    });

    await project.deleteOne();

    res.json({
      message: 'Project and its tickets deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
