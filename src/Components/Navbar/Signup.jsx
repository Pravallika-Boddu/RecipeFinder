import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format!");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    try {
      if (!formData.mobileNumber.startsWith("+")) {
        alert("Please include country code (e.g., +1 for US, +91 for India)");
        return;
      }
  
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        mobileNumber: formData.mobileNumber,
      });
  
      setShowOTPVerification(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP!");
    }
  };
  const handleVerifyOTP = async () => {
    try {
      const { username, email, mobileNumber, password, role } = formData;
  
      console.log("Verifying OTP with:", {
        username,
        email,
        mobileNumber,
        password,
        role,
        otp,
      });
  
      // Verify OTP and register the user
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        username,
        email,
        mobileNumber,
        password,
        role,
        otp,
      });
  
      alert(response.data.message); // "OTP verified and user registered successfully!"
      setShowLogin(true); // Redirect to login after successful registration
    } catch (error) {
      alert(error.response?.data?.message || "Failed to verify OTP and register user!");
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
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
          <button type="button" onClick={handleVerifyOTP}>
            Verify OTP
          </button>
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
        <form onSubmit={(e) => e.preventDefault()} className="signup-form">
          <h2>Find it. Cook it. Love it</h2>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Ordinary">Ordinary</option>
            <option value="Chef">Chef</option>
          </select>
          <button type="button" onClick={handleSendOTP}>
            Sign Up
          </button>
          <h4>
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowLogin(true); // Toggle to Login component
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