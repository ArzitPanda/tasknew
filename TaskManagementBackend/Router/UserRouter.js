const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.js");
const UserTemp = require("../Models/TempUser.js");

// Route for user registration (signup)

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // Check if the user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getUser/:userId", async (req, res) => {
  try {
    // Get the token from the request headers
    // const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    // const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract userId from the query parameters
    const userId = req.params.userId;

    // Check if the userId in the token matches the userId in the query parameters
    // if (decodedToken.userId !== userId) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // If the userId matches, find the user in the database
    const user = await User.findById(userId).populate("Teams");

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the user exists, return the user data
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: query, $options: "i" } }, // Case-insensitive search for email
        // Case-insensitive search for DateOfBirth
        // Add more fields here if needed
      ],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
