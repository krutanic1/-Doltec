import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

const Loginwithotp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
     setLoading(true);
    try {
      await axios.post(`${API}/sendotp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    }finally {
      setLoading(false);
    }

  };

  //  Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
     setLoading(true);
    try {
      const response = await axios.post(`${API}/verifyotp`, { email, otp });
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

        setTimeout(() => {
          navigate("/Home");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP!");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div id="loginwithotp">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="loginform">
        <div className="backandexit">
          <Link to="/StudentLogin">&#8592;</Link>
          <Link to="/">&#10005;</Link>
        </div>
        <h2>Login with Otp</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <button type="submit">
               {loading ? "Sending..." : "Send OTP"}
                </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <button type="submit">
                 {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
          </form>
        )}
        <p>--------------------or--------------------</p>
        <div className="loginwith">
          <Link to="/StudentLogIn">Login with password</Link>
        </div>
      </div>
    </div>
  );
};

export default Loginwithotp;
