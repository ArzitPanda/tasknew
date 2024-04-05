const express = require("express");
const QueryRouter = express.Router();
const TaskQuery = require("../Models/TaskQuery");
const {model} = require("../Models/Query");
const User = require("../Models/user.js");
const webpush = require('../webpush.js')
 module.exports =function(io)
 {
  QueryRouter.post("/api/query", async (req, res) => {
    const { From, To, Task, question, Type } = req.body;

    const queries = new model({ request: question, answer: [] });

    const taskQuery = new TaskQuery({
      From: From,
      To: To,
      Task,
      queries: [queries],
      Type: Type,
    });

    const savedTaskQuery = await taskQuery.save();

    const user = await User.findById(From)

    const userTo = await User.findById(To);


console.log({type:"Query",From:user?.name||user._doc.name,query:question})




    io.to(To).emit("Notification",{type:"Query",From:user?.name||user._doc.name,query:question});


    
      
    const payload = JSON.stringify({
      title: 'New Query For You',
      body: `Query by ${user.name}`,
      type:`QUERY`
      // You can add more data if needed
  });
    






  webpush.sendNotification(userTo?.pushSubscription||userTo._doc?.pushSubscription,payload).then(res=>{res}).catch(err=>{console.log(err)})

    res.send(savedTaskQuery);
  });
  //new query
  QueryRouter.post("/api/taskquery/:TaskQueryid", async (req, res) => {
    try {
      const { question } = req.body;
      const { TaskQueryid } = req.params;

      // Create a new query using the queryModel
      const newQuery = new queryModel({
        request: question,
        answer: [], // Assuming answer is empty initially
      });

      // Find the TaskQuery by its ID
      const taskQuery = await TaskQuery.findById(TaskQueryid);

      if (!taskQuery) {
        return res.status(404).json({ message: "TaskQuery not found" });
      }

      // Push the new query to the queries array of the TaskQuery
      taskQuery.queries.push(newQuery);

      // Save the updated TaskQuery
      await taskQuery.save();

      res.status(201).json(taskQuery);
    } catch (error) {
      console.error("Error creating query:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  QueryRouter.post("/api/taskquery/:taskqueryid/:queryId", async (req, res) => {
    try {
      const { taskqueryid, queryId } = req.params;
      const { answer } = req.body;

      // Find the TaskQuery document
      const taskQuery = await TaskQuery.findById(taskqueryid);
      if (!taskQuery) {
        return res.status(404).json({ message: "TaskQuery not found" });
      }

      // Find the query within the queries array
      const queryToUpdate = taskQuery.queries.find(
        (query) => query._id.toString() === queryId
      );
      if (!queryToUpdate) {
        return res
          .status(404)
          .json({ message: "Query not found within TaskQuery" });
      }

      // Push the answer to the answer array
      queryToUpdate.answer.push(answer);

      // Save the modified TaskQuery document
      await taskQuery.save();

      res.status(200).json({ message: "Answer added successfully", taskQuery });
    } catch (error) {
      console.error("Error answering query:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  QueryRouter.put("/api/taskquery/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { Type, status } = req.body;

      // Validate input data
      if (!Type || !status) {
        return res
          .status(400)
          .json({ message: "Type and status are required fields" });
      }

      // Find the TaskQuery by ID
      const taskQuery = await TaskQuery.findById(id);
      if (!taskQuery) {
        return res.status(404).json({ message: "TaskQuery not found" });
      }

      // Update type and status
      taskQuery.Type = Type;
      taskQuery.status = status;

      // Save the updated TaskQuery
      await taskQuery.save();

      res
        .status(200)
        .json({ message: "TaskQuery updated successfully", taskQuery });
    } catch (error) {
      console.error("Error updating TaskQuery:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  QueryRouter.delete('/api/taskquery/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the TaskQuery document
        const deletedTaskQuery = await TaskQuery.findByIdAndDelete(id);

        if (!deletedTaskQuery) {
            return res.status(404).json({ message: 'TaskQuery not found' });
        }

        res.status(200).json({ message: 'TaskQuery deleted successfully', deletedTaskQuery });
    } catch (error) {
        console.error('Error deleting TaskQuery:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



QueryRouter.get('/api/taskqueries', async (req, res) => {
    try {
        // Extract query parameters
        const { status, Type, From, To, Task } = req.query;
        
        // Construct filter object based on query parameters
        const filter = {};
        if (status) filter.status = status;
        if (Type) filter.Type = Type;
        if (From) filter.From = From;
        if (To) filter.To = To;
        if (Task) filter.Task = Task;

        // Fetch TaskQuery documents based on the constructed filter
        const taskQueries = await TaskQuery.find(filter)
        .populate('From', 'name') // Populate 'From' field with 'name' only
        .populate('To', 'name')   // Populate 'To' field with 'name' only
        .populate('Task', ' taskName');

        res.status(200).json(taskQueries);
    } catch (error) {
        console.error('Error fetching TaskQueries:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

QueryRouter.get('/api/taskqueries/:id', async (req, res) => {
    try {
        // Extract TaskQuery ID from request parameters
        const { id } = req.params;

        // Fetch TaskQuery document by ID
        const taskQuery = await TaskQuery.findById(id);

        // Check if the TaskQuery document exists
        if (!taskQuery) {
            return res.status(404).json({ message: 'TaskQuery not found' });
        }

        // Respond with the fetched TaskQuery document
        res.status(200).json(taskQuery);
    } catch (error) {
        console.error('Error fetching TaskQuery by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

return QueryRouter;
 }




