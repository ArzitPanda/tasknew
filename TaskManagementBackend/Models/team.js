const { default: mongoose } = require("mongoose");

const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
    teamCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
 
});
const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };