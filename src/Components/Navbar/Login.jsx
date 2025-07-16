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
  const [resetData, setResetData] = useState({ 
    email: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [otp, setOtp] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://recipefinder-99mo.onrender.com/api/auth/login", formData, { withCredentials: true });
      setMessage(response.data.message);

      if (response.data.success) {
        const userRole = response.data.user.role;
        const userId = response.data.user._id;

        localStorage.setItem("userId", userId);

        if (userRole === "Chef") {
          navigate("/chef");
        } else if (userRole === "Ordinary") {
          navigate("/normal");
        } else {
          console.error("Unknown user role:", userRole);
          setMessage("Invalid user role! Please contact support.");
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials! Please try again.");
    }
  };

  // Handle OTP request for reset password (now using email)
  const handleSendOtp = async () => {
    try {
      if (!resetData.email) {
        alert("Please enter your email");
        return;
      }

      const response = await axios.post("https://recipefinder-99mo.onrender.com/api/auth/mail/send-otp", {
        email: resetData.email,
        purpose: "reset-password"
      });
      
      alert(response.data.message);
      setShowOtpVerification(true);
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data);
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // Handle OTP verification and password reset (now using email)
  const handleVerifyOtp = async () => {
    try {
      if (resetData.newPassword !== resetData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      const response = await axios.post("https://recipefinder-99mo.onrender.com/api/auth/mail/verify-otp", {
        email: resetData.email,
        otp,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword
      });
      
      alert(response.data.message);
      setShowOtpVerification(false);
      setShowForgotPassword(false);
      setResetData({ email: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data);
      alert(error.response?.data?.message || "Invalid OTP or password requirements not met");
    }
  };

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

      {/* Forgot Password Modal - Updated to use email */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Send OTP to email */}
              {!showOtpVerification && (
                <>
                  <input
                    type="email"
                    placeholder="Your registered email"
                    value={resetData.email}
                    onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                    required
                  />
                  <button type="button" onClick={handleSendOtp}>Send OTP</button>
                </>
              )}

              {/* Step 2: Verify OTP and Reset Password */}
              {showOtpVerification && (
                <>
                  <p>OTP sent to: {resetData.email}</p>
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

              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowOtpVerification(false);
                  setResetData({ email: "", newPassword: "", confirmPassword: "" });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;