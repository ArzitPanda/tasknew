const mongoose = require('mongoose');
const queryModel = require('./Query');



const TaskQuerySchema  = mongoose.Schema({

    From:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    To: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Task:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task',
    },
    queries: [queryModel.query],

    Type:{
        type: String,
        enum: ['UPDATE', 'HELP','ANNOUNCEMENT','GENERAL'],
        default: 'GENERAL',
    },

    status: {
        type: String,
        enum: ['open', 'close'],
        default: 'open',
    },

},{timestamps:true})


const TaskQuery = mongoose.model('TaskQuery', TaskQuerySchema);

module.exports = TaskQuery;

