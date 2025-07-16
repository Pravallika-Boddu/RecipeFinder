import React, { useState, useEffect } from 'react';
import { User, Edit, Lock, Phone, Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import Header from './Header';

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

        const response = await axios.get(`https://recipefinder-99mo.onrender.com/api/auth/${userId}`);
        const userData = response.data;

        // Handle profile picture URL
        let profilePicUrl = userData.profilePicture || '';
        if (profilePicUrl && !profilePicUrl.startsWith('http')) {
          profilePicUrl = `https://recipefinder-99mo.onrender.com${profilePicUrl}`;
        }

        setUser(userData);
        setFormData(userData);
        setProfilePicture(profilePicUrl);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again later.');
      }
    };

    fetchUserData();
  }, [isEditing]); // Refresh when editing state changes

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
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // Convert to base64 for preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicture(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID is missing. Please log in again.');
      }

      // Check if role is being changed
      const roleChanged = formData.role !== user.role;

      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('role', formData.role);

      // Only append profile picture if it's a new one
      if (profilePicture && profilePicture !== user.profilePicture) {
        if (profilePicture.startsWith('data:')) {
          const blob = await fetch(profilePicture).then(res => res.blob());
          formDataToSend.append('profilePicture', blob, 'profile.jpg');
        } else {
          formDataToSend.append('profilePicture', profilePicture);
        }
      }

      const response = await axios.put(
        `https://recipefinder-99mo.onrender.com/api/auth/${userId}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update local state with the response data
      const updatedUser = response.data;
      let updatedProfilePic = updatedUser.profilePicture || '';
      if (updatedProfilePic && !updatedProfilePic.startsWith('http')) {
        updatedProfilePic = `https://recipefinder-99mo.onrender.com${updatedProfilePic}`;
      }

      setUser(updatedUser);
      setFormData(updatedUser);
      setProfilePicture(updatedProfilePic);
      setIsEditing(false);
      setError('');

      // If role was changed, force logout
      if (roleChanged) {
        alert('Your role has been changed. Please login again to continue.');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        window.location.href = '/login'; // Full page reload to clear state
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile. Please try again.');
      
      // If unauthorized (due to role change), force logout
      if (error.response?.status === 401) {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.post('https://recipefinder-99mo.onrender.com/api/auth/mail/send-otp', {
        email: formData.email,
      });
      if (response.data.success) {
        setShowOTPPopup(false);
        setShowPasswordPopup(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('https://recipefinder-99mo.onrender.com/api/auth/mail/verify-otp', {
        email: formData.email,
        otp,
        newPassword,
        confirmPassword,
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
      <Header />
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

        {error && (
          <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Profile Picture Section */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <img
              src={`${profilePicture || '/default-profile.png'}?${Date.now()}`}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e5e7eb',
              }}
              onError={(e) => {
                e.target.src = '/default-profile.png';
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
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user); // Reset form data
                  setProfilePicture(user.profilePicture || '');
                }}
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
                  <p>We'll send OTP to your email:</p>
                  <p style={{ fontWeight: 'bold' }}>{formData.email}</p>
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