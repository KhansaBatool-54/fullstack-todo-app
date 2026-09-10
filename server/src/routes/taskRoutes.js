const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addAttachment,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Every task route requires a valid token — apply protect to all of them at once
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

router.post('/:id/attachments', upload.single('file'), addAttachment);

module.exports = router;