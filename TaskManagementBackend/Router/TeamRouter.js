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




router.get('/team/get/:teamId',async (req,res)=>{

        const teamId = req.params.teamId;


        const team = await Team.findById(teamId).populate('tasks').exec();


     res.send(team.tasks)


})








/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             teamName: Team A
 *             description: A description of Team A
 *             teamCreator: <user-id>
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Team with this name already exists
 *       500:
 *         description: Internal Server Error
 */
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
    const savedTeam = await newTeam.save();

    res.status(201).json(savedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for adding a user to a team
/**
 * @swagger
 * /add-user/{teamId}:
 *   post:
 *     summary: Add a user to a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: <user-id>
 *     responses:
 *       200:
 *         description: User added to the team successfully
 *       404:
 *         description: Team or user not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/team/add-user/:teamId', async (req, res) => {
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

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for updating a team
/**
 * @swagger
 * /update/{teamId}:
 *   put:
 *     summary: Update a team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             teamName: Updated Team Name
 *             description: Updated description
 *             isActive: true
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal Server Error
 */
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
/**
 * @swagger
 * /delete/{teamId}:
 *   delete:
 *     summary: Delete a team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: ID of the team
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal Server Error
 */
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

module.exports = router;
