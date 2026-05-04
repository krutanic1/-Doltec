import React, { useState, useEffect, Profiler } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import { GoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from "react-hot-toast";
const CommunityLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("com-user");
    if (user) {
      navigate("/CommunityDashboard", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
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
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // console.log("Sending login request:", formData);
      const response = await axios.post(`${API}/community-login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200 && response.data.success) {
        toast.success("Login successful!");
         setTimeout(() => {
          const userData = {
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          Profile: response.data.profile,
        };
      
        localStorage.setItem("com-user", JSON.stringify(userData));
        setFormData({ email: "", password: "" });
        setErrors({});
        navigate("/CommunityDashboard", { replace: true });
        }, 1000);
      } else {
        toast.error("Login failed. Please try again.");
        console.error("Login failed, response not successful:", response.data);
        setErrors({ server: response.data.message || "Login failed. Please try again." });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        server:
          error.response?.data?.message ||
          "Failed to connect to the server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const checkAuthGmail = async (email) => {
    console.log("Checking auth for email:", email);
    try {
      const response = await axios.post(`${API}/checkauthcommunitygmail`, {email});
      console.log("fetch",response.data);
      if (response.status === 200) {
    
        toast.success("Login successful!");
        setTimeout(() => {
           const userData = {
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          profile: response.data.profile,
        };
      
        localStorage.setItem("com-user", JSON.stringify(userData));
          navigate("/CommunityDashboard", { replace: true }); 
        }, 1000);
      }
    } catch (err) {
      toast.error("Login failed!");
      console.log(err.response?.data?.error || "Login failed");
    }
  };

 const credentialResponse = (response) => {
    try {
      const credential = response.credential;
      const decodedToken = JSON.parse(atob(credential.split(".")[1]));
      console.log(decodedToken);
      console.log("User Email:", decodedToken.email);
      checkAuthGmail(decodedToken.email);
    } catch (err) {
      console.log("Error decoding Google token", err);
    }
  };

  const credentialfailed = () => {
    alert("Google Login Failed!");
  };

  return (
    <div id="communitylogin">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="login-container">
        <div className="login-image-side"></div>
        <div className="login-form-wrapper">
          <div className="login-form-container">
            <Link to="/" className="login-back-link">
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </Link>
            <h2 className="login-title">Welcome</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-wrapper">
                <label htmlFor="email" className="login-label">
                  Email
                </label>
                <input
                  className={`login-input peer ${errors.email ? "input-error" : ""}`}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="input-error-text">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="login-input-wrapper">
                <label htmlFor="password" className="login-label">
                  Password
                </label>
                <input
                  className={`login-input peer ${errors.password ? "input-error" : ""}`}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <span
                  onClick={handleTogglePasswordVisibility}
                  className="toggle-icon"
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </span>
                {errors.password && (
                  <p id="password-error" className="input-error-text">
                    {errors.password}
                  </p>
                )}
              </div>
              {errors.server && (
                <p className="input-error-text">{errors.server}</p>
              )}
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? "Logging In..." : "Log In"}
              </button>
            </form>
             <div className="divline">--- or continue with google ---</div>
            <div className="continuewithgoogle">
              <GoogleLogin className="googlelogin" onSuccess={credentialResponse} onError={credentialfailed}/>
            </div>
            <div className="login-footer">
              Don't have an account?{" "}
              <Link className="login-signup-link" to="/CommunitySignup">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLogin;