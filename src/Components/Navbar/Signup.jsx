import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import logo from '../../assets/logo.png';
import Login from "./Login";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "Ordinary",
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email format!");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return false;
    }
    setError("");
    return true;
  };

  const handleSendOTP = async () => {
    try {
      if (!formData.email) {
        setError("Email is required!");
        return;
      }

      setLoading(true);
      const response = await axios.post("https://recipefinder-99mo.onrender.com/api/auth/send-otp", {
        email: formData.email
      });

      if (response.data.message === "OTP sent to email successfully!") {
        setShowOTPVerification(true);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);
    const response = await axios.post(
      "https://recipefinder-99mo.onrender.com/api/auth/verify-otp",
      {
        email: formData.email,
        otp: otp,
        userData: {  // Send user data in nested object
          username: formData.username,
          mobileNumber: formData.mobileNumber,
          password: formData.password,
          role: formData.role
        }
      }
    );

    if (response.data.success) {
      alert(response.data.message || "Registration successful! Please login.");
      setShowLogin(true);
    } else {
      // Show detailed error from backend
      setError(response.data.message);
      
      // If email is already verified, offer to go to login
      if (response.data.message.includes("already verified")) {
        setShowLogin(true);
      }
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Verification failed";
    setError(errorMsg);
    
    // If it's an OTP error, offer to resend
    if (errorMsg.includes("OTP")) {
      setError(`${errorMsg} Would you like to resend the OTP?`);
    }
  } finally {
    setLoading(false);
  }
};

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://recipefinder-99mo.onrender.com/api/auth/send-otp", {
        email: formData.email
      });

      if (response.data.message === "OTP sent to email successfully!") {
        alert("New OTP sent successfully!");
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (showLogin) {
    return <Login />;
  }

  if (showOTPVerification) {
    return (
      <div className="signup-container">
        <form onSubmit={(e) => e.preventDefault()} className="signup-form">
          <h2>OTP Verification</h2>
          <p>We've sent a 6-digit OTP to your email: {formData.email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            maxLength="6"
            required
          />
          {error && <div className="error-message">{error}</div>}
          <div className="otp-buttons">
            <button 
              type="button" 
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP & Register"}
            </button>
            <button 
              type="button" 
              onClick={handleResendOTP}
              disabled={loading}
              className="resend-btn"
            >
              Resend OTP
            </button>
          </div>
          <p className="back-link" onClick={() => setShowOTPVerification(false)}>
            ← Back to registration
          </p>
        </form>
      </div>
    );
  }

  return (
    <div>
      <nav className='container'>
        <img src={logo} alt="" className='logo' />
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
      <div className="signup-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) {
            handleSendOTP();
          }
        }} className="signup-form">
          <h2>Find it. Cook it. Love it</h2>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            minLength="3"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            pattern="[0-9]{10}"
            title="Please enter a 10-digit mobile number"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength="6"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
            minLength="6"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Ordinary">Ordinary User</option>
            <option value="Chef">Chef</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
          <h4>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowLogin(true);
              }}
            >
              Login here
            </a>
          </h4>
        </form>
      </div>
    </div>
  );
};

export default Signup;