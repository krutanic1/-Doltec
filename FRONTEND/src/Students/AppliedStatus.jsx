import { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import Cookies from "js-cookie";

const AppliedStatus = () => {
  const [joblist, setJoblist] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const userId = localStorage.getItem("user");
    const token = Cookies.get("authToken");

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get(`${API}/appliedjobs`,{headers: { Authorization: token}});
      setJoblist(response.data);
    } catch (error) {
      console.error("Fetch applied jobs error:", error.message);
    }
  };

  const fetchUserInterviews = async () => {
    try {
      const response = await axios.get(`${API}/user-interviews`,{headers: { Authorization: token}});
      const interviewData = Array.isArray(response.data) ? response.data : response.data.interviews || [];
      setInterviews(interviewData);
    } catch (error) {
      console.error("Fetch user interviews error:", error.message);
      setInterviews([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAppliedJobs();
      fetchUserInterviews();
      const interval = setInterval(fetchUserInterviews, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    if (joblist && joblist.length > 0 && !selectedJob) {
      setSelectedJob(joblist[0]);
    }
  }, [joblist]);

  const handleSelectedJobDetails = (job) => {
    setSelectedJob(job);
    fetchUserInterviews();
  };

  const selectedJobInterviews = interviews.find(
    (interview) => interview.applicationId === selectedJob?._id
  )?.interviews || [];

  const getFinalInterviewStatus = () => {
    const interview = interviews.find(
      (interview) => interview.applicationId === selectedJob?._id
    );
    if (!interview || !interview.interviewStatusUpdatedByHR) {
      return "Pending";
    }
    if (interview.interviewOverviewStatus?.toLowerCase() === "rejected") {
      return "Rejected";
    }
    if (interview.shortListed) {
      return "Shortlisted";
    }
    return "Pending";
  };

  const getOfferLetterStatus = () => {
    const interview = interviews.find(
      (interview) => interview.applicationId === selectedJob?._id
    );
    if (!interview || !interview.offerLetterSent) {
      return "Not Assigned";
    }
    return interview.offerLetter && interview.offerLetter !== "Not Assigned" ? (
      <a href={interview.offerLetter} target="_blank" rel="noopener noreferrer">
        View Offer Letter
      </a>
    ) : (
      "Not Assigned"
    );
  };

  return (
    <div id="appliedjoblist">
      <div className="joblist__container">
        <div className="joblist__sidebar">
          {joblist.map((job, index) => (
            <div
              onClick={() => handleSelectedJobDetails(job)}
              key={index}
              className="job__titleandlocation"
            >
              <div className="company__name">
                <strong>{job.jobId.jobTitle}</strong>
                <p>{job.jobId.city}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="joblist__content">
          {selectedJob && (
            <div className="job__details">
              <div className="job__apply">
                <h2 className="job__title">{selectedJob.jobId.jobTitle}</h2>
                <p>{selectedJob.jobId.location}</p>
              </div>
              <div className="application__status">
                <h2>Applications Overview</h2>
                <p>
                  HR reviewed application and status is:{" "}
                  <span
                    className={`status--${
                      selectedJob.status?.toLowerCase() === "selected"
                        ? "selected"
                        : selectedJob.status?.toLowerCase() === "rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {selectedJob.status?.toLowerCase() === "selected"
                      ? "Selected"
                      : selectedJob.status?.toLowerCase() === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </p>
              </div>
              <div className="application__status">
                <p>
                  Company reviewed application and status is:{" "}
                  <span
                    className={`status--${
                      selectedJob.companyStatus?.toLowerCase() === "selected"
                        ? "selected"
                        : selectedJob.companyStatus?.toLowerCase() === "rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {selectedJob.companyStatus?.toLowerCase() === "selected"
                      ? "Selected"
                      : selectedJob.companyStatus?.toLowerCase() === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </p>
              </div>
              <div className="application__status candidate-evaluation">
                <h2>Candidate Evaluation Process</h2>
                {selectedJobInterviews.length > 0 ? (
                  selectedJobInterviews
                    .sort((a, b) => a.round - b.round)
                    .map((interview, index) => (
                      <div key={index} className="interview__details">
                        <h3>Round {interview.round}</h3>
                        <p>
                          <strong>Date:</strong>{" "}
                          {interview.date
                            ? new Date(interview.date).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Mode of Interview:</strong>{" "}
                          {interview.mode || "N/A"}
                        </p>
                        <p>
                          <strong>Interviewer Name:</strong>{" "}
                          {interview.interviewer || "N/A"}
                        </p>
                        <p>
                          <strong>Link for Meet/Place:</strong>{" "}
                          {interview.link ? (
                            <a
                              href={interview.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {interview.link}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </p>
                        <p>
                          <strong>Feedback:</strong>{" "}
                          {interview.feedbackUpdatedByHR
                            ? interview.interviewStatus || "N/A"
                            : "Pending HR update"}
                        </p>
                      </div>
                    ))
                ) : (
                  <p>No interview updates available.</p>
                )}
                <p className={`final-status status--${getFinalInterviewStatus().toLowerCase()}`}>
                  <strong>Final Interview Status:</strong> {getFinalInterviewStatus()}
                </p>
              </div>
                  <div className="application__status offer-letter">
                    <h2>Offer Letter</h2>
                    <p>
                    <strong>Status:</strong> {getOfferLetterStatus()}
                    </p>
                  </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedStatus;