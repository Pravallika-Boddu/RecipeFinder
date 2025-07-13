import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import Signup from "./Signup";
import logo from '../../assets/logo.png';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetData, setResetData] = useState({ mobileNumber: "", newPassword: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", formData, { withCredentials: true });
    setMessage(response.data.message);

    if (response.data.success) {
      const userRole = response.data.user.role; // Convert to lowercase to avoid case mismatch
      const userId = response.data.user._id; // Get the userId from the response

      console.log("User Role:", userRole); // Debugging
      console.log("User ID:", userId); // Debugging

      // Store userId in localStorage
      localStorage.setItem("userId", userId);
      console.log("Stored userId in localStorage:", localStorage.getItem("userId")); // Debugging

      // Redirect based on role
      if (userRole === "Chef") {
        navigate("/chef"); // Replace with your actual Chef page route
      } else if (userRole === "Ordinary") {
        navigate("/normal"); // Replace with your actual Ordinary User page route
      } else {
        console.error("Unknown user role:", userRole);
        setMessage("Invalid user role! Please contact support.");
      }
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Invalid credentials! Please try again.");
  }
};
  // Handle OTP request for reset password
  const handleSendOtp = async () => {
    try {
      // Ensure mobile number is in E.164 format
      const mobileNumber = resetData.mobileNumber.startsWith("+") ? resetData.mobileNumber : `+91${resetData.mobileNumber}`;

      console.log("Sending OTP request with:", { mobileNumber, purpose: "reset-password" });

      const response = await axios.post("http://localhost:5000/api/auth/send", {
        mobileNumber,
        purpose: "reset-password", // Set purpose to reset-password
      });
      alert(response.data.message);
      setShowOtpVerification(true); // Show OTP verification input
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Handle OTP verification and password reset
  const handleVerifyOtp = async () => {
    try {
      // Ensure mobile number is in E.164 format
      const mobileNumber = resetData.mobileNumber.startsWith("+") ? resetData.mobileNumber : `+91${resetData.mobileNumber}`;

      console.log("Verifying OTP with:", { mobileNumber, otp, purpose: "reset-password", newPassword: resetData.newPassword, confirmPassword: resetData.confirmPassword });

      const response = await axios.post("http://localhost:5000/api/auth/verify", {
        mobileNumber,
        otp,
        purpose: "reset-password", // Set purpose to reset-password
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      });
      alert(response.data.message);
      setShowOtpVerification(false); // Hide OTP verification input
      setShowForgotPassword(false); // Close the reset password modal
      setResetData({ mobileNumber: "", newPassword: "", confirmPassword: "" }); // Clear fields
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data);
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  // Render Signup component if showSignup is true
  if (showSignup) {
    return <Signup />;
  }

  return (
    <div>
      <nav className='container'>
        <img src={logo} alt="Logo" className='logo'/>
        <ul>
          <li><Link to="/">Home</Link></li> 
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/signup">Recipes</Link></li>
          <li className='txt'>
            <Link to="/signup">
              <button className='btn'>Login/Signup</button>
            </Link>
          </li>    
        </ul>
      </nav>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome back to RecipeFinder</h2>
          {message && <p className="message">{message}</p>}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>Forgot Password?</p>
          <button type="submit">Login</button>
          <h5>
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSignup(true);
              }}
            >
              Signup here
            </a>
          </h5>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Send OTP */}
              {!showOtpVerification && (
                <>
                  <input
                    type="text"
                    placeholder="Mobile Number (e.g., +911234567890)"
                    value={resetData.mobileNumber}
                    onChange={(e) => setResetData({ ...resetData, mobileNumber: e.target.value })}
                    required
                  />
                  <button type="button" onClick={handleSendOtp}>Send OTP</button>
                </>
              )}

              {/* Step 2: Verify OTP and Reset Password */}
              {showOtpVerification && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={resetData.confirmPassword}
                    onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                    required
                  />
                  <button type="button" onClick={handleVerifyOtp}>Reset Password</button>
                </>
              )}

              <button type="button" onClick={() => setShowForgotPassword(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;