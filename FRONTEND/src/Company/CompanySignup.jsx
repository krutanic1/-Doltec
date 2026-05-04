import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import toast, { Toaster } from "react-hot-toast";
const CompanySignup = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    otherCompanyType: "",
    position: "",
    businessmodel: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "companyName" ||
        name === "password" ||
        name === "confirmPassword"
          ? value.trim()
          : value,
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.companyType === "Other" && !formData.otherCompanyType) {
      toast.error("Please specify the company type");
      return;
    }
    const dataToSubmit = {
      companyName: formData.companyName,
      companyType: formData.companyType,
      otherCompanyType: formData.otherCompanyType,
      position: formData.position,
      businessmodel: formData.businessmodel,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };
    try {
      const res = await axios.post(`${API}/company-signup`, dataToSubmit);
      // console.log('Response:', res.data);
      if (res.data.success) {
        localStorage.setItem("companyId", res.data.companyId);
        toast.success("SignUp successful");
        setTimeout(() => {
          navigate("/CompanyLogin");
        }, 1500);
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Error message:", err.message);
      toast.error(
        "An error occurred during signup. Please try again with diffrent email."
      );
    }
  };
  return (
    <div id="companysignup">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="signup-container">
        {/* Left Form Side */}
        <div className="signup-form-wrapper">
          <div className="signup-form-container">
            <Link to="/" className="back-link">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h1 className="signup-title">Company Signup</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="signup-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={formData.email}
                onChange={handleChange}
                className="signup-input"
                required
              />
              <input
                type="number"
                name="phone"
                placeholder="Company Phone"
                value={formData.phone}
                onChange={handleChange}
                className="signup-input"
                required
              />
              <select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className="signup-input"
                required
              >
                <option value="" disabled>
                  Select company type
                </option>
                <option value="Service-based">Service-based</option>
                <option value="Product-based">Product-based</option>
                <option value="IT">IT</option>
                <option value="Non-IT">Non-IT</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
              {formData.companyType === "Other" && (
                <input
                  type="text"
                  name="otherCompanyType"
                  placeholder="Please specify"
                  value={formData.otherCompanyType}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              )}
              <input
                type="text"
                name="position"
                placeholder="Your Position"
                value={formData.position}
                onChange={handleChange}
                className="signup-input"
                required
              />
              <input
                type="text"
                name="businessmodel"
                placeholder="Your Business Model"
                value={formData.businessmodel}
                onChange={handleChange}
                className="signup-input"
                required
              />
              {/* Password */}
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="signup-input"
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
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="signup-input"
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
              <button type="submit" className="signup-button">
                Sign Up
              </button>
              <div className="signup-footer">
                Already have an account? <Link to="/CompanyLogin">Login</Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="signup-image-side" />
      </div>
    </div>
  );
};

export default CompanySignup;
