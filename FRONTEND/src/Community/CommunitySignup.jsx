import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API"; 

const CommunitySignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Basic input validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.match(/^\d{10}$/) && formData.phone) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (formData.password.length < 13) {
      newErrors.password = "Password must be at least 13 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API}/community-signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
      });

      if (response.status === 201) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        alert("Sign Up Successful! Redirecting to login...");
        navigate("/CommunityLogin");
      }
    } catch (error) {
      if (error.response) {
        setErrors({ server: error.response.data.message || "Signup failed" });
      } else {
        setErrors({ server: "Network error, please try again" });
      }
      console.error("Signup error:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };

  return (
    <div id="communitysignup">
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <div className="signup-form-container">
            <Link to="/" className="signup-back-link">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h2 className="signup-title">Welcome</h2>
            <p className="signup-subtitle">Sign up for a new community account</p>

            {errors.server && <p className="signup-error">{errors.server}</p>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="signup-input-wrapper">
                <input
                  className={`signup-input peer ${errors.name ? "input-error" : ""}`}
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="input-error-text">{errors.name}</p>}
              </div>

              <div className="signup-input-wrapper">
                <input
                  className={`signup-input peer ${errors.email ? "input-error" : ""}`}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="input-error-text">{errors.email}</p>}
              </div>

              <div className="signup-input-wrapper">
                <input
                  className={`signup-input peer ${errors.phone ? "input-error" : ""}`}
                  id="phone"
                  name="phone"
                  placeholder="Phone Number (Optional)"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="input-error-text">{errors.phone}</p>}
              </div>

              <div className="signup-input-wrapper">
                <input
                  className={`signup-input peer ${errors.password ? "input-error" : ""}`}
                  id="password"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={handleTogglePasswordVisibility} className="toggle-icon">
                  {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                </span>
                {errors.password && <p className="input-error-text">{errors.password}</p>}
              </div>

              <div className="signup-input-wrapper">
                <input
                  className={`signup-input peer ${errors.confirmPassword ? "input-error" : ""}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span onClick={handleToggleConfirmPasswordVisibility} className="toggle-icon">
                  {showConfirmPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                </span>
                {errors.confirmPassword && (
                  <p className="input-error-text">{errors.confirmPassword}</p>
                )}
              </div>

              <button type="submit" className="signup-button">
                Sign Up
              </button>
            </form>

            <div className="signup-footer">
              Already have an account?{" "}
              <Link className="signup-login-link" to="/CommunityLogin">
                Log in
              </Link>
            </div>
          </div>
        </div>
        <div className="signup-image-side" />
      </div>
    </div>
  );
};

export default CommunitySignup;