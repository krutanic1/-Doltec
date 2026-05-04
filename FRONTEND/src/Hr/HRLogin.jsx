import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import Cookies from "js-cookie";
import { GoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from "react-hot-toast";
const HRLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (Cookies.get("hrToken")) {
        navigate("/HRHome");
      }
    }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/hrlogin`, {
        email,
        password,
      });
      if (response.data) {
        localStorage.setItem("HrId", response.data.HrId);
        Cookies.set("hrToken", response.data.token, {
          expires: 1,
          secure: true,
          sameSite: "none",
          path: "/",
        });
      } else {
        console.error("HrId is undefined in response");
      }
      setEmail("");
      setPassword("");
      alert("Login successful!");
      navigate("/HRHome");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

   const checkAuthGmail = async (email) => {
      try {
        const response = await axios.post(`${API}/checkauthgmail`, {email});
        // console.log("fetch",response.data);
        if (response.status === 200) {
      
          toast.success("Login successful!");
          setTimeout(() => {
             localStorage.setItem("HrId", response.data.HrId);
        Cookies.set("hrToken", response.data.token, {
          expires: 1,
          secure: true,
          sameSite: "none",
          path: "/",
        });
            navigate("/HRHome");
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
        // console.log(decodedToken);
        // console.log("User Email:", decodedToken.email);
        checkAuthGmail(decodedToken.email);
      } catch (err) {
        console.log("Error decoding Google token", err);
      }
    };
  
    const credentialfailed = () => {
      toast.error("Google Login Failed!");
    };

  return (
    <div id="HRLogin">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="hr-login-container">
        <div className="hr-login-image-side" />
        <div className="hr-login-form-side">
          <form onSubmit={handleSubmit} className="hr-login-form-wrapper">
            <Link to="/" className="hr-login-back">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h2 className="hr-login-title">Log in</h2>
            <input
              placeholder="Email..."
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="hr-login-input"
              required
            />
            <div className="hr-login-password-wrapper">
              <input
                placeholder="Password..."
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hr-login-input"
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
            <button type="submit" className="hr-login-button">
              Login
            </button>

             <div className="continuewithgoogle">
              <div className="hr-login-divline">--- or continue with google ---</div>
             <GoogleLogin className="googlelogin" onSuccess={credentialResponse} onError={credentialfailed}/>
             </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default HRLogin;
