const express = require('express');
const { Task } = require("../Models/task.js");
const User = require("../Models/user.js");
const { Team}= require("../Models/team.js")
const TaskRouter = express.Router();

// Get all tasks
/**
 * @swagger
 * /api/Task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - taskName: Task 1
 *                 description: Description of Task 1
 *                 dueDate: 2024-12-31T23:59:59.999Z
 *                 team: Team 1
 *                 assignedBy: User 1
 *                 assignedTo: User 2
 *                 status: In Progress
 *               - taskName: Task 2
 *                 description: Description of Task 2
 *                 dueDate: 2024-12-31T23:59:59.999Z
 *                 team: Team 2
 *                 assignedBy: User 3
 *                 assignedTo: User 1
 *                 status: To Do
 */
TaskRouter.get('/api/Task', (req, res) => {
  Task.find()
    .then((tasks) => res.status(200).json(tasks))
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});


// Get a specific task by ID
/**
 * @swagger
 * /api/Task/{taskId}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               taskName: Task 1
 *               description: Description of Task 1
 *               dueDate: 2024-12-31T23:59:59.999Z
 *               team: Team 1
 *               assignedBy: User 1
 *               assignedTo: User 2
 *               status: In Progress
 *       404:
 *         description: Task not found
 */
TaskRouter.get('/api/Task/:taskId', (req, res) => {
  const taskId = req.params.taskId;

  Task.findById(taskId)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(task);
    })
    .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
});



/**
 * @swagger
 * /api/Task/add-to-member/{userId}:
 *   post:
 *     summary: Add a task to a team member
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the team member
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             taskName: New Task
 *             description: Description of the new task
 *             dueDate: 2025-01-31T23:59:59.999Z
 *             team: Team 1
 *             assignedBy: User 1
 *             status: To Do
 *     responses:
 *       201:
 *         description: Task added successfully
 *         content:
 *           application/json:
 *             example:
 *               taskName: New Task
 *               description: Description of the new task
 *               dueDate: 2025-01-31T23:59:59.999Z
 *               team: Team 1
 *               assignedBy: User 1
 *               assignedTo: User 2
 *               status: To Do
 *       404:
 *         description: User not found
 */
TaskRouter.post('/api/Task/add-to-member/:userId', async (req, res) => {
  const { taskName, description, dueDate, team, assignedBy, status } = req.body;
  const userId = req.params.userId;

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new task and assign it to the user
    const newTask = new Task({
      taskName,
      description,
      dueDate,
      team,
      assignedBy,
      assignedTo: userId,
      status,
    });

    // Save the new task to the database
    const savedTask = await newTask.save();

const Teams = await Team.findById(team);
    Teams.tasks.push(savedTask._id);
    userExists.tasks.push(savedTask._id)
    await userExists.save()
    await Teams.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a task by ID
/**
 * @swagger
 * /api/Task/{taskId}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             taskName: Updated Task
 *             description: Updated description
 *             dueDate: 2025-02-28T23:59:59.999Z
 *             team: Updated Team
 *             assignedBy: Updated User
 *             assignedTo: Updated User
 *             status: Completed
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             example:
 *               taskName: Updated Task
 *               description: Updated description
 *               dueDate: 2025-02-28T23:59:59.999Z
 *               team: Updated Team
 *               assignedBy: Updated User
 *               assignedTo: Updated User
 *               status: Completed
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
TaskRouter.put('/api/Task/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { taskName, description, dueDate, team, assignedBy, assignedTo, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName, description, dueDate, team, assignedBy, assignedTo, status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete a task by ID
/**
 * @swagger
 * /api/Task/{taskId}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID of the task
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
TaskRouter.delete('/api/Task/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await Task.findByIdAndRemove(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = TaskRouter;
