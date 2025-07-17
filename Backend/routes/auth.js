const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require('../models/User');
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // Added for JWT support

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d' // Token expires in 1 day
  });
};

// Improved OTP generation and validation
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Enhanced send OTP endpoint
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email format!" 
      });
    }

    // Check if verified user exists
    const existingVerifiedUser = await User.findOne({ email, verified: true });
    if (existingVerifiedUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered and verified!" 
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Upsert user with OTP
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          otp,
          otpExpiry,
          verified: false
        },
        $setOnInsert: {
          email,
          username: `temp_${Date.now()}`,
          mobileNumber: '0000000000',
          password: 'temporary_password'
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    // Send OTP email
    const mailOptions = {
      from: `"Recipe Finder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Recipe Finder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Recipe Finder Verification</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true,
      message: "OTP sent to email successfully!" 
    });

  } catch (error) {
    console.error("Error in /send-otp route:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to send OTP!",
      error: error.message 
    });
  }
});

// Enhanced verify OTP endpoint
router.post("/verify-otp", async (req, res) => {
  try {
    const { username, email, mobileNumber, password, role, otp } = req.body;

    // Basic validation
    if (!username || !email || !mobileNumber || !password || !role || !otp) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required!" 
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "No user found with this email. Please request a new OTP."
      });
    }

    // Check verification status
    if (user.verified) {
      return res.status(400).json({ 
        success: false,
        message: "This email is already verified. Please login instead."
      });
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired OTP!"
      });
    }

    // Update user details
    user.username = username;
    user.mobileNumber = mobileNumber;
    user.password = await bcrypt.hash(password, 10);
    user.role = role;
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // Generate token for immediate login
    const token = generateToken(user._id);

    res.status(200).json({ 
      success: true,
      message: "Registration successful!",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error("Error verifying OTP:", error);
    const message = error.code === 11000 
      ? "Username or mobile number already exists" 
      : "Registration failed";
    
    res.status(500).json({ 
      success: false,
      message,
      error: error.message
    });
  }
});

// Enhanced login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    if (!user.verified) {
      return res.status(403).json({ 
        success: false,
        message: "Account not verified. Please verify your email first." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

// Password reset endpoints
router.post("/mail/send-otp", async (req, res) => {
  try {
    const { email, purpose = "password reset" } = req.body;

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format!" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "No account found with this email!" 
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: `"Recipe Finder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Password Reset OTP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Password Reset</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: "OTP sent to your email successfully!" 
    });

  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process OTP request!",
      error: error.message
    });
  }
});

router.post("/mail/verify-otp", async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required!" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Passwords do not match!" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "No account found with this email!" 
      });
    }

    if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP!" 
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: "Password reset successful! You can now login with your new password." 
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to reset password!",
      error: error.message
    });
  }
});

// User profile endpoints
router.get("/api/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('-password -otp -otpExpiry');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password -otp -otpExpiry');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user',
      error: err.message
    });
  }
});

router.put('/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = {
      username: req.body.username,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    };

    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }

    const userBeforeUpdate = await User.findById(userId);
    if (!userBeforeUpdate) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpiry');

    const response = {
      success: true,
      user: updatedUser,
      roleChanged: userBeforeUpdate.role !== updatedUser.role
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile',
      error: error.message 
    });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Logged out successfully!" 
  });
});

module.exports = router;