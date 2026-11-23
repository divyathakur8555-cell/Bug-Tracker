
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import auth from '../middleware/auth.js';

const router = Router();

const RECOVERY_DAYS = 30;

const tokenFor = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET || 'development_secret_change_me',
    { expiresIn: '7d' }
  );

// Permanently remove account data after the recovery period.
async function permanentlyDeleteAccount(user) {
  const userId = user._id;

  const ownedProjects = await Project.find({
    owner: userId
  }).select('_id');

  const ownedProjectIds = ownedProjects.map(project => project._id);

  // Delete tickets belonging to projects owned by this account.
  await Ticket.deleteMany({
    project: { $in: ownedProjectIds }
  });

  // Delete projects owned by this account.
  await Project.deleteMany({
    owner: userId
  });

  // Remove this account from other people's projects.
  await Project.updateMany(
    { teamMembers: userId },
    { $pull: { teamMembers: userId } }
  );

  // Preserve shared tickets but remove references to this account.
  await Ticket.updateMany(
    { assignee: userId },
    { $set: { assignee: null } }
  );

  await Ticket.updateMany(
    { createdBy: userId },
    { $set: { createdBy: null } }
  );

  await Ticket.updateMany(
    { 'comments.user': userId },
    { $set: { 'comments.$[comment].user': null } },
    {
      arrayFilters: [{ 'comment.user': userId }]
    }
  );

  await User.deleteOne({ _id: userId });
}

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

// LOGIN AND ACCOUNT RECOVERY
router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (
      !user ||
      !(await bcrypt.compare(req.body.password || '', user.password))
    ) {
      return res.status(401).json({
        message: 'Email or password is incorrect'
      });
    }

    if (user.deletedAt) {
      const recoveryDeadline =
        new Date(user.deletedAt).getTime() +
        RECOVERY_DAYS * 24 * 60 * 60 * 1000;

      if (Date.now() > recoveryDeadline) {
        await permanentlyDeleteAccount(user);

        return res.status(410).json({
          message: 'The 30-day recovery period has expired. This account has been permanently deleted.'
        });
      }

      // Restore account during the recovery period.
      user.deletedAt = null;
      user.isActive = true;
      await user.save();

      return res.json({
        message: 'Your account has been successfully recovered.',
        token: tokenFor(user.id),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isActive: true
        }
      });
    }

    if (!user.isActive) {
      user.isActive = true;
      await user.save();
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

// UPDATE PROFILE
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

// REQUEST ACCOUNT DELETION
router.delete('/account', auth, async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Please enter your password to confirm account deletion.'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Incorrect password. Account was not deleted.'
      });
    }

    user.deletedAt = new Date();
    user.isActive = false;
    await user.save();

    res.json({
      message: 'Account deletion scheduled. You have 30 days to recover your account by logging in again.',
      recoveryDays: RECOVERY_DAYS
    });
  } catch (error) {
    next(error);
  }
});

// CURRENT USER
router.get('/me', auth, (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;
