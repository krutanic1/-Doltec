import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import "react-calendar/dist/Calendar.css";
import Cookies from "js-cookie";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const token = Cookies.get("authToken");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { alert("Passwords do not match!"); return; }
    try {
       const config = { headers: { Authorization: token, },};
      const response = await axios.put(`${API}/change-password`, {password} , config);
      alert("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error( "Error changing password:",error.response?.data?.error || error.message);
      alert("Failed to change password. Please try again.");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API}/user`,{ headers: { Authorization: token, }});
      console.log("User data fetched:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data?.error || error.message
      );
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSizeKB = selectedFile.size / 1024;
      if (fileSizeKB > 50) {
        alert("File size must be under 50KB!");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
         const config = { headers: { Authorization: token, },};
        const response = await axios.post(`${API}/uploadprofile`,{image: reader.result}, config);
        if (response.status === 200) {
          alert("Profile photo updated successfully!");
          setFile(null);
          fetchUserData();
        } else {
          alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        alert("Error uploading photo.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div id="userSetting">
      <div className="setting__container">
      <div className="profile">
        <div>
          <div className="profile-photo-wrapper">
            <form onSubmit={handleUpload} className="profile-photo-form">
              <div className="photo-upload-container group">
                <img
                  src={user.profile || "/default-avatar.png"}
                  alt="Profile"
                  className="profile-img"
                />
                <label className="overlay-label">
                  <i className="fa fa-edit icon-style"></i>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>

              <button type="submit" className="upload-btn">
                Update
              </button>
            </form>
          </div>
          <h2>Name: {user.name}</h2>
          <h2>Email: {user.email}</h2>
          <h2>Phone: {user.phone}</h2>
        </div>
      </div>
      <div className="password">
        <h1>Change Password</h1>
        <form onSubmit={handleChangePassword} className="password-form">
          <div className="password-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={handleTogglePasswordVisibility}
              className="toggle-icon"
            >
              {!showPassword ? (
                <i class="fa fa-eye-slash"></i>
              ) : (
                <i class="fa fa-eye"></i>
              )}
            </span>
          </div>
          <div className="password-input-group">
            <input
             type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={handleToggleConfirmPasswordVisibility}
              className="toggle-icon"
            >
              {!showConfirmPassword ? (
                <i class="fa fa-eye-slash"></i>
              ) : (
                <i class="fa fa-eye"></i>
              )}
            </span>
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Settings;
