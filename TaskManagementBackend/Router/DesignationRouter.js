const express = require('express');
const router = express.Router();
const Designation = require('../Models/Designation');

// Get all designations
router.get('/', async (req, res) => {
    try {
        const designations = await Designation.find();
        res.json(designations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all designations by teamId
router.get('/team/:teamId', async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const designations = await Designation.find({ team: teamId });
        res.json(designations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new designation
router.post('/', async (req, res) => {
    const designation = new Designation({
        user: req.body.user,
        team: req.body.team,
        designation: req.body.designation
    });

    try {
        const newDesignation = await designation.save();
        res.status(201).json(newDesignation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
