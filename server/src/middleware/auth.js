
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'development_secret_change_me'
    );

    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Account not found'
      });
    }

    if (user.deletedAt) {
      return res.status(403).json({
        message: 'Account deletion is pending. Log in to recover your account.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account is deactivated. Please log in again to reactivate it.'
      });
    }

    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.error('AUTH ERROR:', error.message);

    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
}
