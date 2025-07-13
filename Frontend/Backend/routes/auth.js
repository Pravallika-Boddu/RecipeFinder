const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require('../models/User');
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }

    // Check if verified user already exists
    const existingVerifiedUser = await User.findOne({ email, verified: true });
    if (existingVerifiedUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Find or create user without requiring username/password
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new unverified user with only email
      user = new User({
        email,
        verified: false
      });
    }

    // Update OTP fields
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Recipe Finder',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email successfully!" });

  } catch (error) {
    console.error("Error in /send-otp route:", error);
    res.status(500).json({ message: "Failed to send OTP!" });
  }
});
router.post("/verify-otp", async (req, res) => {
  try {
    const { username, email, mobileNumber, password, role, otp } = req.body;

    // Validate all fields
    if (!username || !email || !mobileNumber || !password || !role || !otp) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Find unverified user
    const user = await User.findOne({ email, verified: false });
    if (!user) {
      return res.status(400).json({ message: "User not found or already verified!" });
    }

    // Verify OTP
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP!" });
    }

    // Check if username is already taken by other users
    const usernameExists = await User.findOne({ 
      username, 
      _id: { $ne: user._id } 
    });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // Update user with all details
    user.username = username;
    user.mobileNumber = mobileNumber;
    user.password = await bcrypt.hash(password, 10);
    user.role = role;
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ 
      message: "Registration successful!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ 
      message: error.code === 11000 
        ? "Username or mobile number already exists" 
        : "Registration failed" 
    });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🟡 Login attempt for email:", email);

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for email:", email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id, // Include userId in the response
        role: user.role, // Include user role in the response
      },
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Temporary storage for OTPs (in-memory)
const otpStore = {};

// OTP for Password Reset
router.post("/send", async (req, res) => {
  const { email, purpose = "password reset" } = req.body;

  try {
    // Validate email format
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

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Store OTP in database instead of memory
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Enhanced email content
    const mailOptions = {
      from: `"Recipe Finder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Recipe Finder Verification Code`,
      text: `Your OTP for ${purpose} is: ${otp}\nThis code expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h2 style="color: #2c3e50;">Recipe Finder</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hello,</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; 
                        margin: 20px 0; font-size: 24px; font-weight: bold; 
                        letter-spacing: 2px;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; text-align: center; 
                      font-size: 12px; color: #7f8c8d;">
            <p>© ${new Date().getFullYear()} Recipe Finder. All rights reserved.</p>
          </div>
        </div>
      `,
      // Important headers to prevent spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    };

    // Send email with error handling
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
      return res.json({ 
        success: true, 
        message: "OTP sent to your email successfully!" 
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email. Please try again.",
        error: emailError.message
      });
    }

  } catch (error) {
    console.error("Error in /send route:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to process OTP request!",
      error: error.message
    });
  }
});

router.post("/verify", async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  try {
    // Validate inputs
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

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP code!" 
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: "OTP has expired!" 
      });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.json({ 
      success: true, 
      message: "Password reset successful! You can now login with your new password." 
    });

  } catch (error) {
    console.error("Error in /verify route:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to reset password!",
      error: error.message
    });
  }
});

// Logout Route (unchanged)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully!" });
});

// Get User by Email instead of mobileNumber
router.get("/api/user/:email", async (req, res) => {
try {
  const { email } = req.params; // Changed from mobileNumber to email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    username: user.username,
    email: user.email,
    mobileNumber: user.mobileNumber, // Keeping mobileNumber in response if needed
    role: user.role,
  });
} catch (error) {
  console.error("Error fetching user:", error);
  res.status(500).json({ message: "Server error" });
}
});
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});
router.put('/:userId', upload.single('profilePicture'), async (req, res) => {
  const { userId } = req.params;
  const { username, email, mobileNumber, role } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only the fields that are provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (role) user.role = role;

    // Update the profile picture if a new one is uploaded
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Send the updated user data in the response
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
module.exports = router;