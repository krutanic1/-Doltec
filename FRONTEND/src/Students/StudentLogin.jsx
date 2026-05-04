import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

const StudentLogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("authToken")) {
      navigate("/Home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API}/userlogin`, {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      toast.success("Login successful");
      if (response.status === 200) {
        const userDataToStore = {
          ...response.data.user,
          jobLimit: 2,
          planType: null,
          accessLevel: "basic",
        };
        localStorage.setItem("user", JSON.stringify(userDataToStore));
        Cookies.set("authToken", response.data.token, {
          expires: 1,
          secure: true,
          sameSite: "none",
          path: "/",
        });
        navigate("/Home");
      }
    } catch (error) {
      toast.error("Invalid email or password");
      console.error(error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  return (
    <div id="studentlogin">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="login-container">
        <div className="login-image-side"></div>
        <div className="login-form-wrapper">
          <div className="login-form-container">
            <Link to="/" className="login-back-link">
              <i className="fa fa-arrow-left"></i>
            </Link>
            <h2 className="login-title">Welcome</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-input-wrapper">
                <input
                  className="login-input peer"
                  required
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email" className="login-label">
                  Email
                </label>
              </div>
              <div className="login-input-wrapper">
                <input
                  className="login-input peer"
                  required
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <label htmlFor="password" className="login-label">
                  Password
                </label>
              </div>
              <button type="submit" className="login-button">
                Log In
              </button>
            </form>
            <div className="login-footer">
              Don't have an account?
              <Link className="login-signup-link" to="/StudentSignUp">
                Sign up
              </Link>
            </div>
            <div
              style={{ textAlign: "center", color: "gray" }}
              className="loginwithotp"
            >
              <Link className="login-otp-link" to="/Loginwithotp">
                Login with OTP
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogIn;
