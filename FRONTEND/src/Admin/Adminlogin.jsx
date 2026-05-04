import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import Cookies from "js-cookie";
const Adminlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };
    useEffect(() => {
      if (Cookies.get("adminToken")) {
        navigate("/Dashboard");
      }
    }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      const response =  await axios.post(`${API}/adminlogin`, { email, password });
      console.log(response.data);
      localStorage.setItem("admin", "true");
      localStorage.setItem("name" , response.data.name);
      Cookies.set("adminToken", response.data.token, { expires: 1, secure: true, sameSite: "none", path: "/",});
      alert("Login successful");
      setError(""); 
      setEmail("");
      setPassword("");
      navigate("/Dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div id="adminlogin">
    <div className="login-container">
      <div className="login-content">
        <div className="login-image">
          <img src="https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg?t=st=1745306533~exp=1745310133~hmac=156d655cebaf7659248fc27c845249ce8dc72cad8f8fee39fca481aea1868fb2&w=740" alt="Admin Visual" />
        </div>
        <div className="login-box">
           <div className="heading">
            <div></div>
            <h2 className="">Admin LogIn</h2>
            <Link to="/" className=""><i class="fa fa-arrow-left"></i></Link>
           </div>
          <div className="login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
            />
            <div className="password-wrapper">
               <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
            />
            <span onClick={handleTogglePasswordVisibility} className="toggle-icon">
                  {!showPassword ? <i class="fa fa-eye-slash"></i> : <i class="fa fa-eye"></i>}
            </span>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLogin} className="login-button">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Adminlogin;
