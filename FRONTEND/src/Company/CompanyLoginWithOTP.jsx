import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../API";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

const CompanyLoginWithOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/companysendotp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    }
  };

  //  Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/companyverifyotp`, { email, otp });
      if (res.status === 200) {
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
        alert("Login successful");
        setTimeout(() => {
          navigate("/CompanyDashboard");
        }, 1500);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP!");
    }
  };

  return (
    <div id="loginwithotp">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="loginform">
        <div className="backandexit">
          <Link to="/CompanyLogin">&#8592;</Link>
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
              <button type="submit">Send OTP</button>
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
              <button type="submit">Verify OTP</button>
            </div>
          </form>
        )}
        <p>--------------------or--------------------</p>
        <div className="loginwith">
          <Link to="/CompanyLogin">Login with password</Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyLoginWithOTP;
