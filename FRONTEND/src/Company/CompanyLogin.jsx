import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
const CompanyLogin = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("companyToken")) {
      navigate("/CompanyDashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value.trim() });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/company-login`, loginData);
      toast.success("Login successful");
      if (res.data.success) {
        const companyData = {
          companyId: res.data.companyId,
          name: res.data.name,
          email: res.data.email,
          subscriptionPlan: res.data.subscriptionPlan,
          accessLevel: res.data.accessLevel,
          subscriptionEnd: res.data.subscriptionEnd,
        };
        localStorage.setItem("company", JSON.stringify(companyData));
        localStorage.setItem("companyId", res.data.companyId);
        localStorage.setItem("name", res.data.name);
        Cookies.set("companyToken", res.data.token, {
          expires: 1,
          secure: true,
          sameSite: "none",
          path: "/",
        });
        setLoginData({ email: "", password: "" });
        setTimeout(() => {
          navigate("/CompanyDashboard");
        }, 1500);
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Check your email and password"
      );
      console.error(
        "Server Error:",
        err.response?.data?.message || err.response?.data?.error
      );
    }
  };

  return (
    <div id="companylogin">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="company-login-container">
        <div className="company-login-image" />
        <div className="company-login-form-wrapper">
          <div className="company-login-form-container">
            <Link to="/" className="back-link">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h1 className="company-login-title">Company Login</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleChange}
                className="company-login-input"
                required
              />
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="company-login-input"
                  required
                />
                <span
                  onClick={handleTogglePasswordVisibility}
                  className="toggle-icon"
                >
                  {!showPassword ? (
                    <i className="fa fa-eye-slash"></i>
                  ) : (
                    <i className="fa fa-eye"></i>
                  )}
                </span>
              </div>
              <button type="submit" className="company-login-button">
                Login
              </button>
              <div className="signup-redirect">
                Don't have an account?{" "}
                <Link to="/CompanySignup" className="signup-link">
                  Sign Up
                </Link>
              </div>
              <div className="signup-redirect">
                <Link to="/CompanyLoginWithOTP" className="signup-link">
                  Login with OTP
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
