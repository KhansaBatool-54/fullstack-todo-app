const Task = require('../models/Task');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, decisionDetails } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      userId: req.user._id, // comes from protect middleware
      title,
      description,
      status,
      priority,
      category,
      dueDate,
      decisionDetails,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks belonging to the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single task by ID (only if it belongs to the logged-in user)
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task (only if it belongs to the logged-in user)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only update fields that were actually sent in the request body
    const fields = ['title', 'description', 'status', 'priority', 'category', 'dueDate', 'decisionDetails'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update only the status of a task (used for Kanban drag-and-drop later)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['TODO', 'IN_PROGRESS', 'NEED_DECISION', 'DONE'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task (only if it belongs to the logged-in user)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload a file and attach it to an existing task
const addAttachment = async (req, res) => {
  try {
    // Step A: find the task, but only if it belongs to the logged-in user
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Step B: check that a file was actually sent
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Step C: multer + cloudinary already uploaded the file
    // req.file contains the info Cloudinary gave back
    const attachment = {
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      uploadedAt: new Date(),
    };

    // Step D: push it into the task's attachments array and save
    task.attachments.push(attachment);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addAttachment,
};