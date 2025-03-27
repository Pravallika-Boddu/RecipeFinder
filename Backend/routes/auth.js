const express = require("express");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const User = require('../models/User');
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });
router.post("/send-otp", async (req, res) => {
  try {
    let { mobileNumber } = req.body;
    console.log("Received mobileNumber:", mobileNumber);

    if (!mobileNumber.startsWith("+")) {
      return res.status(400).json({ message: "Mobile number must include country code!" });
    }

    const isValidMobileNumber = /^\+\d{1,15}$/.test(mobileNumber);
    if (!isValidMobileNumber) {
      return res.status(400).json({ message: "Invalid mobile number format!" });
    }

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile number already registered!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);

    await User.findOneAndUpdate(
      { mobileNumber },
      { otp, otpExpiry: Date.now() + 10 * 60 * 1000 },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("Sending OTP via Twilio...");
    await client.messages.create({
      body: `Your OTP for Recipe Finder is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    });

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error in /send-otp route:", error);
    res.status(500).json({ message: "Failed to send OTP!" });
  }
});
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    const { username, email, mobileNumber, password, role, otp } = req.body;

    // Ensure all required fields are present
    if (!username || !email || !mobileNumber || !password || !role || !otp) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Ensure the mobile number is in E.164 format
    if (!mobileNumber.startsWith("+")) {
      mobileNumber = `+91${mobileNumber}`; // Append country code for India
    }

    // Validate mobile number format
    const isValidMobileNumber = /^\+\d{1,15}$/.test(mobileNumber);
    if (!isValidMobileNumber) {
      return res.status(400).json({ message: "Invalid mobile number format!" });
    }

    // Find the user by mobile number
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      console.log("User not found for mobile number:", mobileNumber);
      return res.status(400).json({ message: "User not registered!" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      console.log("Invalid or expired OTP for mobile number:", mobileNumber);
      return res.status(400).json({ message: "Invalid or expired OTP!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user with all details
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.role = role;
    user.otp = undefined; // Clear OTP
    user.otpExpiry = undefined; // Clear OTP expiry

    // Save the updated user to the database
    await user.save();

    console.log("User saved to database:", user); // Log the saved user

    res.status(200).json({ message: "OTP verified and user registered successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error); // Log the full error
    res.status(500).json({ message: "Failed to verify OTP and register user!" });
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
    const { mobileNumber, purpose } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Store OTP with expiry time
        otpStore[mobileNumber] = { otp, otpExpiry };

        await client.messages.create({
            body: `Your OTP for ${purpose} is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobileNumber,
        });

        res.json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP!" });
    }
});

// Verify OTP & Reset Password
router.post("/verify", async (req, res) => {
    const { mobileNumber, otp, newPassword, confirmPassword } = req.body;

    try {
        const storedOtpData = otpStore[mobileNumber];

        if (!storedOtpData || storedOtpData.otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP!" });
        }

        if (storedOtpData.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired!" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match!" });
        }

        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        delete otpStore[mobileNumber]; // Clear OTP after reset
        res.json({ success: true, message: "Password reset successful!" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, message: "Server error!" });
    }
});
// Logout Route
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully!" });
});
router.get("/api/user/:mobileNumber", async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
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