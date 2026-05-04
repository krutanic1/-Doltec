import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import Cookies from "js-cookie";

const Joblist = () => {
  const [joblist, setJoblist] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchParams, setSearchParams] = useState({
    jobTitle: "",
    location: "",
  });
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobLimit, setJobLimit] = useState(2); 
  const [user, setUser] = useState(null);
  const userIdString = localStorage.getItem("user");
  const token = Cookies.get("authToken");

  const navigate =  useNavigate();

  const getUserId = () => {
    if (!userIdString) return null;
    try {
      const userData = JSON.parse(userIdString);
      return userData?._id?._id || userData?._id || userData;
    } catch (error) {
      console.error("Error parsing userId from localStorage:", error);
      return null;
    }
  };

  const userId = getUserId();

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/company-all-jobs`);
      setJoblist(response.data);
    } catch (error) {
      console.error("Fetch jobs error:", error.message);
    }
  };

  const fetchUserResumes = async () => {
    try {
      const response = await axios.get(`${API}/resume`, { headers: { Authorization: token } });
      setResumes(response.data);
      if (response.data.length > 0 && !selectedResumeId) {
        setSelectedResumeId(response.data[0]._id);
      } else {
        alert("No resumes found. Please create a resume before applying.");
      
        navigate("/Resume");
      }
    } catch (error) {
      console.error("Fetch resumes error:", error.message);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(`${API}/user-applications`, { headers: { Authorization: token } });
      const appliedJobIds = response.data.map((application) => application.jobId);
      // console.log("Fetched applied jobs:", appliedJobIds);
      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error("Fetch applied jobs error:", error.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      if (!userId) {
        console.error("User ID is missing for fetchUserDetails");
        return;
      }
      const response = await axios.get(`${API}/profile`, {
        params: { userId },
        headers: { Authorization: token },
      });
      setUser(response.data);
      setJobLimit(response.data.jobLimit || 2);
    } catch (error) {
      console.error("Fetch user details error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to load user details.");  
    }
  };

  const refreshUserData = useCallback(async () => {
    await fetchUserDetails();
    await fetchAppliedJobs();
    await fetchUserResumes();
  }, [userId, token]);

  useEffect(() => {
    fetchJobs();
    if (userId) {
      refreshUserData();
    }
  }, [userId, refreshUserData]);

  useEffect(() => {
    if (joblist && joblist.length > 0) {
      setSelectedJob(joblist[0]);
    }
  }, [joblist]);

  useEffect(() => {
  }, [user, jobLimit, appliedJobs]);

  const handleSelectedJobDetails = (job) => {
    setSelectedJob(job);
  };

  const handleChange = (e) => { 
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const filtered = joblist.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(searchParams.jobTitle.toLowerCase()) &&
        job.location.toLowerCase().includes(searchParams.location.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleJobApplication = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID is missing. Please ensure you are logged in.");
      return;
    }
    if (!selectedResumeId) {
      alert("No resumes available. Please create a resume before applying.");
      return;
    }
    if (!selectedJob) {
      alert("No job selected.");
      return;
    }

    const now = new Date();
    const isLimitReached = appliedJobs.length >= (user?.jobLimit || jobLimit);
    const isSubscriptionExpired = user?.subscriptionEnd && new Date(user.subscriptionEnd) < now;
    const isPaid = user?.paid || false;

    if (isLimitReached && !isPaid) {
      alert("You have reached your job application limit. Please subscribe to apply for more jobs.");
      return;
    }
    if (isSubscriptionExpired) {
      alert("Your subscription has expired. Please renew to apply for more jobs.");
      return;
    }
    const jobId = selectedJob._id;
    const status = "pending";
    try {
      const response = await axios.post(
        `${API}/apply-job`,
        { userId, resumeId: selectedResumeId, jobId, status },
        { headers: { Authorization: token } }
      );
      // console.log("Application response:", response.data);
      setAppliedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
      await refreshUserData(); // Refresh immediately after application
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error.response?.data || error.message, error.stack);
      alert("Error applying for job. Details: " + (error.response?.data?.error || error.message));
    }
  };

  const handleSubscribe = () => {
    window.location.href = "/chooseaplan";
    setTimeout(refreshUserData, 1000); 
  };

  return (
    <div id="joblist">
      <div className="filterandsearchbar">
        <div className="searchbar">
          <input
            type="search"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            name="jobTitle"
            id="jobTitle"
            placeholder="Search by job title..."
            title="Search by job title"
          />
          <input
            type="search"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            name="location"
            id="location"
            placeholder="Search by location..."
            title="Search by location"
          />
          <button  onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="joblist__container">
  <div className="joblist__sidebar">
    {(filteredJobs.length > 0 ? filteredJobs : joblist).map((job, index) => (
      <div
        onClick={() => handleSelectedJobDetails(job)}
        key={index}
        className="job__titleandlocation"
      >
        <div className="company__logo">
          <img src={job.companyLogoUrl || "/default-logo.png"} alt="logo" />
        </div>
        <div className="job__name">
          <strong>{job.jobTitle}</strong>
          <p>{job.city}</p>
        </div>
      </div>
    ))}
  </div>

  <div className="joblist__content">
    {selectedJob && (
      <div className="job__details">
        <div className="job__apply">
          <h1 className="job__title">{selectedJob.jobTitle}</h1>

          {appliedJobs.includes(selectedJob._id) ? (
            <button className="apply__button applied" disabled>Applied</button>
          ) : user?.jobLimit === 0 && !user?.paid ? (
            <button onClick={handleSubscribe} className="subscribe__button">
              Subscribe
            </button>
          ) : (
            <button
              onClick={handleJobApplication}
              disabled={appliedJobs.length >= (user?.jobLimit || jobLimit)}
              className="apply__button"
            >
              Apply Now
            </button>
          )}
        </div>

        <div className="job__overview">
          <p><strong>Company:</strong> {selectedJob.companyName}</p>
          <p><strong>Location:</strong> {selectedJob.location}</p>
          <p><strong>Type:</strong> {selectedJob.jobType}</p>
          <p><strong>Timing:</strong> {selectedJob.jobTiming}</p>
          <p><strong>Positions:</strong> {selectedJob.noofposition}</p>
          <p>
            <strong>Salary:</strong> ₹{selectedJob.salary.minSalary} - ₹
            {selectedJob.salary.maxSalary} per {selectedJob.salary.per}
          </p>
          <p><strong>Working Days:</strong> {selectedJob.workingDays}</p>
          <p><strong>Application Deadline:</strong> {selectedJob.applicationDeadline}</p>
          <p><strong>Experience:</strong> {selectedJob.experience} year(s)</p>
        </div>

        <div className="job__requirements">
          <strong>Desired Skills</strong>
          <ul>
            {selectedJob.desiredSkills.split(",").map((skill, idx) => (
              <li key={idx}>• {skill.trim()}</li>
            ))}
          </ul>
        </div>

        <div className="job__description">
          <strong>Job Description</strong>
          <p>{selectedJob.jobDescription.split("\n")[0]}</p>
          <ul>
            {selectedJob.jobDescription
              .split("\n")
              .slice(1)
              .map(
                (line, idx) =>
                  line.trim() !== "" && <li key={idx}>{line}</li>
              )}
          </ul>
        </div>
      </div>
    )}
  </div>
      </div>

    </div>
  );
};

export default Joblist;