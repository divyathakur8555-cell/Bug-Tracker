
import { Router } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

// Get all projects belonging to the user or shared with them
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { teamMembers: req.user.id }
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

// Create a project
router.post('/', async (req, res, next) => {
  try {
    if (!req.body.title?.trim()) {
      return res.status(400).json({
        message: 'Project title is required'
      });
    }

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description || '',
      owner: req.user.id,
      teamMembers: [req.user.id]
    });

    res.status(201).json(
      await project.populate('teamMembers', 'name email')
    );
  } catch (error) {
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
        { owner: req.user.id },
        { teamMembers: req.user.id }
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

// Update a project
router.patch('/:id', async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
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

// Add a team member
router.post('/:id/members', async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
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

// Permanently delete a project and its tickets
router.delete('/:id', async (req, res, next) => {
  let session;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project id'
      });
    }

    session = await mongoose.startSession();

    let projectNotFound = false;

    await session.withTransaction(async () => {
      const project = await Project.findOne({
        _id: req.params.id,
        owner: req.user.id
      }).session(session);

      if (!project) {
        projectNotFound = true;
        return;
      }

      // Delete all tickets belonging to this project
      await Ticket.deleteMany(
        { project: project._id },
        { session }
      );

      // Delete the project itself
      await Project.deleteOne(
        { _id: project._id },
        { session }
      );
    });

    if (projectNotFound) {
      return res.status(404).json({
        message: 'Project not found or you are not the owner'
      });
    }

    res.json({
      message: 'Project and its tickets deleted successfully'
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

export default router;
