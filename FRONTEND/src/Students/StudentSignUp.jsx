import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";



const StudentSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [formData , setFormData] = useState({
    name: "",
    email: "",
    phone:"",
    password: "",
    confirmPassword: "",
   })

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const navigate = useNavigate();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
     const  response = await axios.post(`${API}/usersignup`, formData)
       setFormData({
        name: "",
        email: "",
        phone:"",
        password: "",
        confirmPassword: "",
       })
       alert("Sign Up Successfully");
       if (response.status === 200) {
        setTimeout(() => {
          navigate("/StudentLogIn");
        }, 1500);
      }
    } catch (error) {
      alert("User already registered");
      console.log(error);
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };


  return (
    <div id="studentsignup">
      <div className="signup-container">
      {/* Left Form Side */}
      <div className="signup-form-wrapper">
        <div className="signup-form-container">
          <Link to="/" className="signup-back-link">
            <i className="fa fa-arrow-left"></i>
          </Link>
          <h2 className="signup-title">Welcome</h2>
          <p className="signup-subtitle">Sign up for a new account</p>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-input-wrapper">
              <input
                className="signup-input peer"
                required
                id="name"
                name="name"
                placeholder="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              {/* <label htmlFor="fullname" className="signup-label">Full Name</label> */}
            </div>

            <div className="signup-input-wrapper">
              <input
                className="signup-input peer"
                required
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {/* <label htmlFor="email" className="signup-label">Email address</label> */}
            </div>

            <div className="signup-input-wrapper">
              <input
                className="signup-input peer"
                required
                id="phone"
                name="phone"
                placeholder="Phone Number"
                type="text"
                value={formData.phone}
                onChange={handleChange}
              />
              {/* <label htmlFor="phone" className="signup-label">Phone Number</label> */}
            </div>

            <div className="signup-input-wrapper">
              <input
                className="signup-input peer"
                required
                id="password"
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
              />
              <span
                  onClick={handleTogglePasswordVisibility}
                  className="toggle-icon">
                  {!showPassword ? <i class="fa fa-eye-slash"></i> : <i class="fa fa-eye"></i>}
                </span>
              {/* <label htmlFor="password" className="signup-label">Password</label> */}
            </div>

            <div className="signup-input-wrapper">
              <input
                className="signup-input peer"
                required
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
               <span
                  onClick={handleToggleConfirmPasswordVisibility}
                  className="toggle-icon"
                >
                  {!showConfirmPassword ? <i class="fa fa-eye-slash"></i> : <i class="fa fa-eye"></i>}
                </span>
              {/* <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label> */}
            </div>

            <button type="submit" className="signup-button">
            Sign Up
            </button>
          </form>

          <div className="signup-footer">
            Already have an account?
            <Link className="signup-login-link" to="/StudentLogIn">Log in</Link>
          </div>
        </div>
      </div>

      <div className="signup-image-side" /></div>
    </div>
  );
};

export default StudentSignUp;
