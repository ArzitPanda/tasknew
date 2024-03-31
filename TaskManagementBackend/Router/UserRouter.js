const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user.js");
const multer = require('multer');
const path = require('path');
const UserTemp = require("../Models/TempUser.js");
const { UserDetail } = require("../Models/userDetails.js");
const cloudinary = require('cloudinary').v2;
const { deleteResources } =require('cloudinary').v2

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








const upload = multer({
  dest: 'uploads/', // Temporary folder for uploaded images (optional)
  limits: { fileSize: 1000000 }, // Limit image size to 1 MB (adjust as needed)
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only JPG, JPEG, and PNG files allowed.'));
    }
  }
});
cloudinary.config({
  cloud_name: 'dtrp3lqrw',
  api_key: '219944792718466',
  api_secret: 'QLBubDThrlnBQLXSB_qwBcAw4N4',
});


router.post('/userdetails', upload.single('profilePhoto'), async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.userId) {
      return res.status(400).json({ message: 'Missing required field: userId' });
    }



    console.log(req.body)
    let photoUrl;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path,{ public_id: `profile/${req.body.userId}/${Date.now()}-${req.file.originalname}`}); // Upload image to Cloudinary
      photoUrl = uploadResult.secure_url; // Use the secure URL from Cloudinary
    }

    const newDetail = new UserDetail({
      user: req.body.userId,
      profilePhoto: photoUrl,
      address: req.body.address, // Optional address
      certifications: req.body.certifications || [] // Optional certifications array
    });

    const savedDetail = await newDetail.save();
    res.status(201).json(savedDetail); // Respond with the created user detail
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user detail' });
  }
});



function removeExtension(filename) {
  // Check if the filename is a string
  if (typeof filename !== 'string') {
    throw new TypeError('Input must be a string');
  }

  // Find the last dot using lastIndexOf
  const lastDotIndex = filename.lastIndexOf('.');

  // If there's no dot, return the original filename
  if (lastDotIndex === -1) {
    return filename;
  }

  // Return the substring up to (but not including) the last dot
  return filename.slice(0, lastDotIndex);
}
// **Update User Detail**
router.put('/userdetails/',upload.single('profilePhoto'), async (req, res) => {



  try {
    // 1. Find the user detail to be updated
    const existingDetail = await UserDetail.findOne({user:req.body.userId});
    if (!existingDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

  
  
      // 2. Handle potential image deletion (if applicable)
      let newProfilePhotoUrl;
      if (req.file) {
  
        if (existingDetail.profilePhoto ) {
          // Delete previous image only if URLs differ
          // ... (Cloudinary or Firebase Storage deletion logic below)
          const publicId = existingDetail.profilePhoto.split('/').pop();
          const public = `profile/${existingDetail.user}/${removeExtension(publicId)}`
          
console.log(public)
         await cloudinary.uploader
          .destroy(public)
          const uploadResult = await cloudinary.uploader.upload(req.file.path,{ public_id: `profile/${existingDetail.user}/${Date.now()}-${req.file.originalname}`}); // Upload image to Cloudinary
          newProfilePhotoUrl = uploadResult.secure_url;


        }
      } else {
        // No new image uploaded, use existing URL if present
        newProfilePhotoUrl = existingDetail.profilePhoto;

      }

      const updatedDetail = await UserDetail.findOneAndUpdate({user:req.body.userId}, {
      $set: {
        user: req.body.userId || existingDetail.user,  // Update user ID if provided
        profilePhoto: newProfilePhotoUrl,
        address: req.body.address || existingDetail.address, // Update address if provided
        certifications: req.body.certifications || existingDetail.certifications // Update certifications if provided
      }
    }, { new: true }); // Return the updated document
        await existingDetail.save();
        
        // Return updated document
  

    res.json(updatedDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user detail' });
  }
});

// **Get User Detail**
router.get('/userdetails/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userDetail = await UserDetail.findOne({user:id})// Populate the 'user' field (optional)
    if (!userDetail) {
      return res.status(404).json({ message: 'User detail not found' });
    }

    res.json(userDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting user detail' });
  }
});






module.exports = router;
