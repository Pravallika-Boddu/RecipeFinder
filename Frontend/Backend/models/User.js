const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    unique: true, 
    trim: true,
    required: function() {
      return this.verified === true; // Only required when verified
    }
  },
  email: { type: String, required: true, unique: true, trim: true },
  mobileNumber: { type: String, trim: true },
  password: { 
    type: String, 
    required: function() {
      return this.verified === true; // Only required when verified
    }
  },
  role: { type: String, enum: ["Chef", "Ordinary"], default: "Ordinary" },
  profilePicture: { type: String, default: "" },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  otp: { type: String },
  otpExpiry: { type: Date },
  verified: { type: Boolean, default: false } // Add verified field
}, { timestamps: true });

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Method to generate a secure password reset token
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex"); // Secure random token
  this.resetToken = resetToken;
  this.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  return resetToken;
};

// Method to generate and store OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  return otp;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;