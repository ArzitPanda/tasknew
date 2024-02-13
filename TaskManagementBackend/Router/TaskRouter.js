const express = require('express');
const { Task } = require("../Models/task.js");
const User = require("../Models/user.js");
const { Team}= require("../Models/team.js")
const TaskRouter = express.Router();
const webpush = require('../webpush.js')


// Get all tasks
module.exports =function(io)
{
  TaskRouter.get('/api/Task', (req, res) => {
    Task.find()
      .then((tasks) => res.status(200).json(tasks))
      .catch((error) => res.status(500).json({ error: 'Internal Server Error' }));
  });
  
  
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
  
  
  
  TaskRouter.get('/api/Task/user/:userId/:teamId',async (req, res) =>{
  
    const userId = req.params.userId;
    const teamId = req.params.teamId;
  
  
    const tasks = await User.findById(userId).populate({ path: 'Tasks', team: { $eq: teamId } });
  
    console.log(tasks)
    
  
  res.send(tasks)
  
  
  
  })
  
  
  
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
  
        io.to(userId).emit("Notification",{type:'Task',data:savedTask})
  
  const Teams = await Team.findById(team);
      Teams.tasks.push(savedTask._id);
      userExists.Tasks.push(savedTask._id)
      await userExists.save()
      await Teams.save();
  
  
      
      const payload = JSON.stringify({
        title: 'New Task Assigned',
        body: `You have been assigned a new task: ${taskName}`,
        // You can add more data if needed
    });
  
    const pushSubscription = userExists.pushSubscription; 
    await webpush.sendNotification(pushSubscription, payload);
  console.log(payload)
      res.status(201).json(savedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
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
  
  return TaskRouter
}


