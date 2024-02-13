const express = require('express');
const router = express.Router();
const {Team} = require('../Models/team.js');
const User = require('../Models/user.js');

// Route for creating a new team
/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API endpoints for managing teams
 */




module.exports = function(io)
{
  router.get('/team/get/:teamId',async (req,res)=>{

    const teamId = req.params.teamId;


    const team = await Team.findById(teamId).populate('tasks').populate('teamMembers').populate('teamCreator').exec();
  console.log(team)

 res.send(team)


})








router.post('/team/create', async (req, res) => {
try {
const { teamName, description, teamCreator } = req.body;

// Check if the team with the provided name already exists
const existingTeam = await Team.findOne({ teamName });
if (existingTeam) {
  return res.status(400).json({ error: 'Team with this name already exists' });
}

// Create a new team
const newTeam = new Team({
  teamName,
  description,
  teamCreator,
});

// Save the team to the database


newTeam.teamMembers.push(teamCreator)
const savedTeam = await newTeam.save()
console.log(savedTeam);
const user = await User.findById(teamCreator);

if (!user) {
  return res.status(404).json({ error: 'User not found' });
}



user.Teams.push(savedTeam._id);
await user.save()

res.status(201).json(savedTeam);
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal Server Error' });
}
});

// Route for adding a user to a team

router.post('/team/adduser/:teamId', async (req, res) => {
try {
const { teamId } = req.params;
const { userId } = req.body;

// Check if the team exists
const team = await Team.findById(teamId);
if (!team) {
  return res.status(404).json({ error: 'Team not found' });
}

// Check if the user exists
const user = await User.findById(userId);
if (!user) {
  return res.status(404).json({ error: 'User not found' });
}

// Add the user to the team's teamMembers array
team.teamMembers.push(userId);


// Save the updated team to the database
const updatedTeam = await team.save();

user.Teams.push(updatedTeam._id);
await user.save()


io.to(userId).emit("Notification",{type:"Team",data:team})
res.status(200).json(updatedTeam);
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal Server Error' });
}
});

// Route for updating a team

router.put('/team/update/:teamId', async (req, res) => {
try {
const { teamId } = req.params;
const { teamName, description, isActive } = req.body;

// Check if the team exists
const team = await Team.findById(teamId);
if (!team) {
  return res.status(404).json({ error: 'Team not found' });
}

// Update team properties
team.teamName = teamName || team.teamName;
team.description = description || team.description;
team.isActive = isActive !== undefined ? isActive : team.isActive;

// Save the updated team to the database
const updatedTeam = await team.save();

res.status(200).json(updatedTeam);
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal Server Error' });
}
});



// Route for deleting a team

router.delete('/team/delete/:teamId', async (req, res) => {
try {
const { teamId } = req.params;

// Check if the team exists
const team = await Team.findById(teamId);
if (!team) {
  return res.status(404).json({ error: 'Team not found' });
}

// Remove the team from the database
await team.remove();

res.status(204).end(); // No content
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal Server Error' });
}
});



router.get('/team/:UserId', async (req, res) =>{

const idx = req.params.UserId;

try {


//  const data = await  User.aggregate([
//     {
//       $match: { // Your query criteria
//         _id: idx,
//       },
//     },
//     {
//       $lookup: {
//         from: 'Team', // Collection name of referenced documents
//         localField: 'Teams', // Array containing IDs
//         foreignField: '_id', // Field matching IDs in referenced collection
//         as: 'populatedArray', // Name for the populated array
//       },
//     },
//   ]).exec();
//   console.log(data)



const user = await User.findById(idx).populate('Teams');





console.log(user )
res.send(user);

} catch (error) {
console.log(error);
res.status(500).json({ error: 'Internal Server Error'})
}


})

return router;
}


