const mongoose = require('mongoose');

// Define Task schema
const taskSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    },

    assignedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do',
    },
    // ... other task properties
});



// Create Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = { Task };
