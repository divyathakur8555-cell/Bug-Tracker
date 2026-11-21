
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import auth from '../middleware/auth.js';

const router = Router();

const tokenFor = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name?.trim() || !email || !password || password.length < 8) {
      return res.status(400).json({
        message: 'Name, email and a password of at least 8 characters are required'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email,
      password: await bcrypt.hash(password, 12),
      isActive: true
    });

    res.status(201).json({
      message: 'Account created successfully',
      token: tokenFor(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) {
      return res.status(401).json({
        message: 'Email or password is incorrect'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account is deactivated. Contact support to reactivate it.'
      });
    }

    res.json({
      message: 'Login successful',
      token: tokenFor(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE PERSONAL INFORMATION
router.patch('/profile', auth, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
});

// DEACTIVATE ACCOUNT
router.patch('/deactivate', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// CHANGE PASSWORD
router.patch('/change-password', auth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const matches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!matches) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        message: 'New password must be different from your current password'
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({
      message: 'Password changed successfully. Please log in again.'
    });
  } catch (error) {
    next(error);
  }
});

// GET PROJECTS OWNED BY CURRENT USER
router.get('/owned-projects', auth, async (req, res, next) => {
  try {
    const projects = await Project.find({
      owner: req.user.id
    }).populate('teamMembers', 'name email');

    res.json({ projects });
  } catch (error) {
    next(error);
  }
});

// PERMANENTLY DELETE ACCOUNT
router.delete('/delete-account', auth, async (req, res, next) => {
  try {
    const { password, projectActions } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Your password is required'
      });
    }

    if (!Array.isArray(projectActions)) {
      return res.status(400).json({
        message: 'Project deletion or transfer choices are required'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Password is incorrect'
      });
    }

    const ownedProjects = await Project.find({
      owner: user._id
    });

    // Every owned project must have exactly one valid action.
    if (projectActions.length !== ownedProjects.length) {
      return res.status(400).json({
        message: 'Choose an action for every project you own'
      });
    }

    const actionMap = new Map();

    for (const action of projectActions) {
      if (
        !action ||
        typeof action.projectId !== 'string' ||
        actionMap.has(action.projectId)
      ) {
        return res.status(400).json({
          message: 'Invalid or duplicate project action'
        });
      }

      actionMap.set(action.projectId, action);
    }

    for (const project of ownedProjects) {
      const action = actionMap.get(project._id.toString());

      if (!action || !['delete', 'transfer'].includes(action.action)) {
        return res.status(400).json({
          message: 'Invalid action for an owned project'
        });
      }

      if (action.action === 'transfer') {
        if (!action.newOwner) {
          return res.status(400).json({
            message: 'Choose a new owner for each transferred project'
          });
        }

        const isTeamMember = project.teamMembers.some(
          member => member.toString() === action.newOwner
        );

        if (!isTeamMember || action.newOwner === user._id.toString()) {
          return res.status(400).json({
            message: 'New owner must be an existing team member'
          });
        }

        const newOwnerExists = await User.exists({
          _id: action.newOwner,
          isActive: true
        });

        if (!newOwnerExists) {
          return res.status(400).json({
            message: 'Selected team member is not an active user'
          });
        }
      }
    }

    // Process project choices.
    for (const project of ownedProjects) {
      const action = actionMap.get(project._id.toString());

      if (action.action === 'delete') {
        // Delete all tickets and comments belonging to this project.
        await Ticket.deleteMany({
          project: project._id
        });

        await Project.deleteOne({
          _id: project._id
        });
      } else {
        // Transfer ownership and remove the new owner from teamMembers.
        await Project.updateOne(
          { _id: project._id, owner: user._id },
          {
            $set: { owner: action.newOwner },
            $pull: { teamMembers: action.newOwner }
          }
        );
      }
    }

    // Remove this user from all other project team memberships.
    await Project.updateMany(
      { teamMembers: user._id },
      { $pull: { teamMembers: user._id } }
    );

    // Unassign tickets assigned to this user.
    await Ticket.updateMany(
      { assignee: user._id },
      { $set: { assignee: null } }
    );

    // Remove comments written by this user.
    await Ticket.updateMany(
      {},
      { $pull: { comments: { user: user._id } } }
    );

    // Delete tickets created by this user that remain in other projects.
    await Ticket.deleteMany({
      createdBy: user._id
    });

    // Finally delete the account.
    await User.deleteOne({
      _id: user._id
    });

    res.json({
      message: 'Account and selected project data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET CURRENT LOGGED-IN USER
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
