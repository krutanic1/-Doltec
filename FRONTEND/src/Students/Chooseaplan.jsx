import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";

const Chooseaplan = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDataString = localStorage.getItem("user");
        if (!userDataString) {
          setError("Please log in to select a plan.");
          navigate("/studentlogin");
          return;
        }

        let userId;
        try {
          const userData = JSON.parse(userDataString);
          userId = userData._id?._id || userData._id || userData;
          if (!userId || typeof userId !== "string") {
            throw new Error("Invalid user data");
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError.message);
          localStorage.removeItem("user");
          setError("Corrupted user data. Please log in again.");
          navigate("/studentlogin");
          return;
        }

        const response = await axios.get(`${API}/profile`, {
          params: { userId },
          headers: { Authorization: localStorage.getItem("authToken") },
        });
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setError(null);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
        setError(error.response?.data?.error || "Failed to fetch user data");
        if (error.response?.status === 404) {
          localStorage.removeItem("user");
          navigate("/studentlogin");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const initiateSubscription = async (planType) => {
    try {
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        setError("Please log in to select a plan.");
        navigate("/studentlogin");
        return;
      }

      let userId;
      try {
        const userData = JSON.parse(userDataString);
        userId = userData._id?._id || userData._id || userData;
        if (!userId || typeof userId !== "string") {
          throw new Error("Invalid user data");
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError.message);
        localStorage.removeItem("user");
        setError("Corrupted user data. Please log in again.");
        navigate("/studentlogin");
        return;
      }

      setLoading(true);
      setError(null);

      const planResponse = await axios.post(
        `${API}/create-subscription`,
        { planType, userId },
        { headers: { Authorization: localStorage.getItem("authToken") } }
      );
      // console.log("Payment initiation response:", planResponse.data);
      const { key_id, order_id, subscription_id, amount } = planResponse.data;

      const paymentId = planType === "daily" ? order_id : subscription_id;

      const options = {
        key: key_id,
        ...(planType === "daily"
          ? { order_id: paymentId }
          : { subscription_id: paymentId }),
        name: "Doltec PVT LTD",
        description: `${
          planType.charAt(0).toUpperCase() + planType.slice(1)
        } Plan (₹${amount})`,
        handler: async function (response) {
          try {
            // console.log("Razorpay payment response:", response);
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
              response;
            const userDataString = localStorage.getItem("user");
            const userData = JSON.parse(userDataString);
            const userId = userData?._id?._id || userData._id || userData;

            const verifyResponse = await axios.post(
              `${API}/verify-subscription`,
              {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                userId,
                planType,
              },
              { headers: { Authorization: localStorage.getItem("authToken") } }
            );
            const profileResponse = await axios.get(`${API}/profile`, {
              params: { userId },
              headers: { Authorization: localStorage.getItem("authToken") },
            });
            setUser(profileResponse.data);
            localStorage.setItem("user", JSON.stringify(profileResponse.data));
            setError(null);
            alert("Subscription successful! Access updated.");
            navigate("/joblist");
          } catch (error) {
            console.error(
              "Error verifying subscription:",
              error.response?.data || error.message
            );
            setError(
              error.response?.data?.error || "Failed to verify subscription"
            );
          }
        },
        prefill: {
          name: user?.name || "Customer Name",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment was cancelled or failed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(
        "Error initiating subscription:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.error ||
          "Failed to start subscription. Please try again."
      );
      if (error.response?.data?.error?.code === "BAD_REQUEST_ERROR") {
        setError(
          "Payment initiation failed due to invalid data. Contact support."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate jobs left based on job limit (relying on backend to sync)
  const getJobsLeft = () => {
    if (!user) return 0;
    return user.jobLimit === -1 ? "Unlimited" : user.jobLimit || 0;
  };

  // Determine if button should be disabled
  const isButtonDisabled = (planType) => {
    if (loading) return true;
    if (!user) return false; 
    const now = new Date();
    const isActiveSubscription =
      user.subscriptionPlan !== "free" &&
      new Date(user.subscriptionEnd) > now &&
      user.jobLimit > 2; // Unlimited case
    const jobsLeft = getJobsLeft();
    return isActiveSubscription || (typeof jobsLeft === "number" && jobsLeft > 0);
  };

  return (
    <div id="chooseaplan">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2>Choose Your Pricing Plan</h2>
          <p>
            Current Plan: {user?.subscriptionPlan || "None"} | Jobs Left:{" "}
            {getJobsLeft()}
          </p>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div className="plans">
          <div className="plan">
            <h2>Daily</h2>
            <div className="price">
              ₹39<span>/Job</span>
            </div>
            <ul>
              <li>Apply to 1 Job</li>
              <li>Basic Application Tracking</li>
              <li>Direct Recruiter Response</li>
            </ul>
            <button
              onClick={() => initiateSubscription("daily")}
              disabled={isButtonDisabled("daily")}
            >
              CHOOSE PLAN
            </button>
          </div>
          <div className="plan">
            <h2>Gold</h2>
            <div className="price">
              ₹899<span>/6 months</span>
            </div>
            <ul>
              <li>Apply to 30 Jobs (valid for 6 months)</li>
              <li>Advanced Application Tracking Dashboard</li>
              <li>Priority Response from Recruiters</li>
              <li>Higher Visibility in Recruiter Searches</li>
              <li>Professional Resume Review</li>
              <li>Interview Preparation Material</li>
            </ul>
            <button
              onClick={() => initiateSubscription("gold")}
              disabled={isButtonDisabled("gold")}
            >
              CHOOSE PLAN
            </button>
          </div>
          <div className="plan">
            <h2>Premium</h2>
            <div className="price">
              ₹2999<span>/Year</span>
            </div>
            <ul>
              <li>Unlimited Job Applications (valid for 1 year)</li>
              <li>Full Application Tracking + Analytics</li>
              <li>Instant Recruiter Connect</li>
              <li>99% Higher Chances of Getting Hired</li>
              <li>AI-Powered Resume Building</li>
              <li>Mock Interview Sessions</li>
              <li>1-on-1 Career Counseling</li>
              <li>Access to Exclusive Job Fairs</li>
              <li>Personalized Job Alerts & Notifications</li>
              <li>Premium Networking Opportunities</li>
            </ul>
            <button
              onClick={() => initiateSubscription("premium")}
              disabled={isButtonDisabled("premium")}
            >
              CHOOSE PLAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chooseaplan;