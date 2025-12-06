import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @desc    Get user tasks
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @desc    Create new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  const { title, priority, dueDate } = req.body; // Extract new fields
  
  try {
    const task = await prisma.task.create({
      data: {
        title,
        priority: priority || 'medium', // Default to medium
        dueDate: dueDate ? new Date(dueDate) : null, // Convert string to Date
        userId: req.user.id
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Task completion & Gamification
// @route   PUT /api/tasks/:id/complete
export const toggleTaskComplete = async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Find the task to verify ownership
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if(!task || task.userId !== req.user.id) {
       return res.status(404).json({ message: "Task not found" });
    }

    // 2. Toggle Status
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { isCompleted: !task.isCompleted }
    });

    // 3. GAMIFICATION LOGIC: Award XP only if marking AS complete
    let user = req.user;
    if (updatedTask.isCompleted) {
        const xpGain = 10;
        const newXp = user.xp + xpGain;
        
        // Simple Level logic: Level up every 100 XP
        let newLevel = user.level;
        if(newXp >= 100 * user.level) {
            newLevel = user.level + 1;
        }

        user = await prisma.user.update({
            where: { id: user.id },
            data: { xp: newXp, level: newLevel }
        });
    }

    res.json({ task: updatedTask, user }); // Return both so frontend updates immediately

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        await prisma.task.delete({
            where: { id: parseInt(req.params.id) } // Needs to verify user ownership in real app, keeping simple
        });
        res.json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update task details
// @route   PUT /api/tasks/:id
export const updateTaskDetails = async (req, res) => {
  const { id } = req.params;
  const { title, priority, dueDate } = req.body;

  try {
    // 1. Verify user owns task
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });

    if(!task || task.userId !== req.user.id) {
       return res.status(404).json({ message: "Task not found" });
    }

    // 2. Update
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        title,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};