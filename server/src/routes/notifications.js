
import { Router } from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = Router();

router.use(auth);

// Get the logged-in user's notifications
router.get("/", async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("actor", "name")
      .populate("ticket", "title")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
});

// Mark one notification as read
router.patch("/:id/read", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user.id,
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.patch("/read-all", async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
});

// Delete one notification
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
});

// Delete all notifications belonging to the logged-in user
router.delete("/", async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipient: req.user.id });

    res.json({ message: "All notifications deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
