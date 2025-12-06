import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getTasks, createTask, toggleTaskComplete, deleteTask, updateTaskDetails } from '../controllers/taskController.js';




const router = express.Router();

// Apply 'protect' middleware to all routes here automatically
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.put('/:id/complete', toggleTaskComplete);
router.delete('/:id', deleteTask);
router.put('/:id', updateTaskDetails);
export default router;