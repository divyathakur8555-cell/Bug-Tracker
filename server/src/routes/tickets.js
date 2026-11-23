
import { Router } from "express";
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";

const router = Router();

router.use(auth);

const canAccess = (projectId, userId) =>
  Project.exists({
    _id: projectId,
    $or: [
      { owner: userId },
      { teamMembers: userId }
    ]
  });

// GET ALL TICKETS OR PROJECT-SPECIFIC TICKETS
router.get("/", async (req, res, next) => {
  try {
    const { project, status, priority, assignee, q } = req.query;

    let projectIds = [];

    if (project) {
      if (!mongoose.isValidObjectId(project)) {
        return res.status(400).json({
          message: "Invalid project ID"
        });
      }

      if (!(await canAccess(project, req.user.id))) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      projectIds = [project];
    } else {
      const accessibleProjects = await Project.find({
        $or: [
          { owner: req.user.id },
          { teamMembers: req.user.id }
        ]
      }).select("_id");

      projectIds = accessibleProjects.map(p => p._id);
    }

    const filter = {
      project: { $in: projectIds }
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    if (q) {
      filter.title = {
        $regex: q,
        $options: "i"
      };
    }

    const tickets = await Ticket.find(filter)
      .populate("project", "title")
      .populate("assignee", "name email")
      .populate("createdBy", "name")
      .populate("comments.user", "name")
      .sort("-updatedAt");

    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

// CREATE TICKET
router.post("/", async (req, res, next) => {
  try {
    const {
      title,
      description,
      project,
      projectId,
      priority = "Medium",
      status = "Todo",
      assignee
    } = req.body;

    // Accept both project and projectId
    const selectedProject = project || projectId;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Ticket title is required"
      });
    }

    if (!selectedProject ||
        !mongoose.isValidObjectId(selectedProject)) {
      return res.status(400).json({
        message: "Please select a valid project"
      });
    }

    if (!(await canAccess(selectedProject, req.user.id))) {
      return res.status(403).json({
        message: "You do not have access to this project"
      });
    }

    if (!["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({
        message: "Invalid ticket priority"
      });
    }

    if (!["Todo", "In Progress", "Done", "Open", "Resolved", "Closed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid ticket status"
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description || "",
      project: selectedProject,
      priority,
      status,
      assignee: assignee || null,
      createdBy: req.user.id
    });

    const savedTicket = await Ticket.findById(ticket._id)
      .populate("project", "title")
      .populate("assignee", "name email")
      .populate("createdBy", "name");

    res.status(201).json(savedTicket);
  } catch (error) {
    next(error);
  }
});

// UPDATE TICKET
router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ticket ID"
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket || !(await canAccess(ticket.project, req.user.id))) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    const allowed = [
      "title",
      "description",
      "priority",
      "status",
      "assignee"
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        ticket[key] = req.body[key];
      }
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("project", "title")
      .populate("assignee", "name email")
      .populate("createdBy", "name");

    res.json(updatedTicket);
  } catch (error) {
    next(error);
  }
});

// DELETE TICKET
router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ticket ID"
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket || !(await canAccess(ticket.project, req.user.id))) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    await ticket.deleteOne();

    res.json({
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// ADD COMMENT
router.post("/:id/comments", async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket || !(await canAccess(ticket.project, req.user.id))) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    if (!req.body.text?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    ticket.comments.push({
      user: req.user.id,
      text: req.body.text.trim()
    });

    await ticket.save();

    await ticket.populate("comments.user", "name");

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
});

export default router;
