import React, { useState, useEffect } from 'react';
import { User, Edit, Lock, Phone, Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression'; // Import image compression library
import Navbar from './Navbarr';

const ViewProfile = ({ onClose = () => {} }) => {
  const location = useLocation();
  const defaultUser = {
    username: 'Guest',
    email: '',
    mobileNumber: '',
    role: 'Ordinary',
    password: '********',
    profilePicture: '',
  };
  const [user, setUser] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...defaultUser });
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID is missing. Please log in again.');
        }

        const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
        const userData = response.data;

        // Ensure the profilePicture URL is complete
        if (userData.profilePicture) {
          userData.profilePicture = `http://localhost:5000${userData.profilePicture}`;
        }

        setUser(userData);
        setFormData(userData);
        setProfilePicture(userData.profilePicture || '');
        setMobileNumber(userData.mobileNumber || ''); // Pre-fill mobile number
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress the image
        const options = {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true, // Use a web worker for better performance
        };
        const compressedFile = await imageCompression(file, options);

        // Convert the compressed file to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicture(reader.result); // Set the base64 string as the profile picture
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  // Handle save action
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID is missing. Please log in again.');
      }

      // Create a FormData object
      const formData = new FormData();

      // Append all fields, including unchanged ones
      formData.append('username', formData.username || user.username);
      formData.append('email', formData.email || user.email);
      formData.append('mobileNumber', formData.mobileNumber || user.mobileNumber);
      formData.append('role', formData.role || user.role);

      // Append the profile picture if it's being updated
      if (profilePicture) {
        const file = await fetch(profilePicture).then((res) => res.blob());
        formData.append('profilePicture', file, 'profilePicture.jpg');
      } else {
        // If the profile picture is not being updated, send the existing one
        formData.append('profilePicture', user.profilePicture);
      }

      // Log the data being sent
      console.log('Sending Data:', {
        username: formData.get('username'),
        email: formData.get('email'),
        mobileNumber: formData.get('mobileNumber'),
        role: formData.get('role'),
        profilePicture: formData.get('profilePicture') ? 'File Uploaded' : 'No File',
      });

      // Send the request to update the profile
      const response = await axios.put(`http://localhost:5000/api/auth/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log the response data
      console.log('Received Response:', response.data);

      // Update the state with the new data
      setIsEditing(false);
      setUser(response.data);
      setError('');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  // Handle OTP sending
  const handleSendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send', {
        mobileNumber,
      });
      if (response.data.success) {
        setShowOTPPopup(false);
        setShowPasswordPopup(true); // Open the password change popup
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };
// Handle password update
const handleUpdatePassword = async () => {
  if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
  }

  try {
      const response = await axios.post('http://localhost:5000/api/auth/verify', {
          mobileNumber,
          otp,
          newPassword,
          confirmPassword, // Ensure confirmPassword is sent to the backend
      });
      if (response.data.success) {
          setShowPasswordPopup(false);
          setError('Password updated successfully.');
      } else {
          setError(response.data.message || 'Failed to update password. Please try again.');
      }
  } catch (error) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Failed to update password. Please try again.');
  }
};

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        {/* Header with Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Profile</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Profile Picture Section */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <img
              src={profilePicture || '/path/to/local/placeholder.png'} // Use a local image
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e5e7eb',
              }}
            />
            {isEditing && (
              <label
                htmlFor="profilePicture"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer',
                }}
              >
                <Edit size={16} />
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePictureChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Basic Info Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Basic Info</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <User size={16} style={{ marginRight: '8px' }} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Globe size={16} style={{ marginRight: '8px' }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Phone size={16} style={{ marginRight: '8px' }} />
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={!isEditing}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <User size={16} style={{ marginRight: '8px' }} />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!isEditing}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: isEditing ? '#ffffff' : '#f9fafb',
              }}
            >
              <option value="Ordinary">Ordinary</option>
              <option value="Chef">Chef</option>
            </select>
          </div>
        </div>

        {/* Account Info Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Account Info</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Lock size={16} style={{ marginRight: '8px' }} />
            <input
              type="password"
              name="password"
              value="********"
              disabled
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
              }}
            />
            <button
              onClick={() => setShowOTPPopup(true)}
              style={{
                marginLeft: '8px',
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Edit/Save Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Edit size={16} style={{ marginRight: '8px' }} />
              Edit Profile
            </button>
          )}
        </div>

        {/* OTP Popup */}
        {showOTPPopup && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Send OTP</h3>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Mobile Number"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </div>
              <button
                onClick={handleSendOTP}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Send OTP
              </button>
              <button
                onClick={() => setShowOTPPopup(false)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Password Change Popup */}
        {showPasswordPopup && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Change Password</h3>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  placeholder="Enter OTP"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </div>
              <button
                onClick={handleUpdatePassword}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordPopup(false)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;