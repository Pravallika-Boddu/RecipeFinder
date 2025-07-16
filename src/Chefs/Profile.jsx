import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [chef, setChef] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`/api/user/profile/${userId}`);
      setUser(response.data.user);
      if (response.data.chef) {
        setChef(response.data.chef);
      }
    };
    fetchProfile();
  }, [userId]);

  // Handle input changes for chef profile
  const handleChefChange = (e) => {
    const { name, value } = e.target;
    setChef({ ...chef, [name]: value });
  };

  // Handle form submission
  const handleSave = async () => {
    const response = await axios.put(`/api/user/profile/${userId}`, { user, chef });
    setUser(response.data.user);
    if (response.data.chef) {
      setChef(response.data.chef);
    }
    setIsEditing(false);
  };

  if (!user || !chef) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Chef Profile</h1>
      <div style={styles.form}>
        {/* Personal Details */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Personal Details</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={chef.firstName || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={chef.lastName || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={chef.email || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="text"
              name="phone"
              value={chef.phone || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={chef.dateOfBirth || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
        </div>

        {/* Address */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Address</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Street</label>
            <input
              type="text"
              name="street"
              value={chef.address?.street || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>City</label>
            <input
              type="text"
              name="city"
              value={chef.address?.city || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>State</label>
            <input
              type="text"
              name="state"
              value={chef.address?.state || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Country</label>
            <input
              type="text"
              name="country"
              value={chef.address?.country || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={chef.address?.postalCode || ""}
              onChange={handleChefChange}
              disabled={!isEditing}
              style={styles.input}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          {isEditing ? (
            <button style={styles.button} onClick={handleSave}>
              Save
            </button>
          ) : (
            <button style={styles.button} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  form: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  section: {
    marginBottom: "20px",
  },
  sectionHeading: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "10px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Profile;