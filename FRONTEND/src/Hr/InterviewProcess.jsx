import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const InterviewProcess = () => {
  const [applications, setApplications] = useState([]);
  const [showInterviewHistory, setShowInterviewHistory] = useState(false);
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const hrId = localStorage.getItem("HrId");


const fetchApplications = async () => {
    if (!hrId) {
      console.error("No HR ID found");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/hr-applications/${hrId}`);
      const filteredApplications = response.data.filter(app => app.companyStatus === 'Selected');
      setApplications(filteredApplications); 
      // console.log("Filtered Applications:", filteredApplications);
      if (selectedApplication) {
        const updatedApp = filteredApplications.find((app) => app._id === selectedApplication._id);
        if (updatedApp) {
          setSelectedApplication(updatedApp);
          setSelectedInterviews(updatedApp.interviews);
        } else {
         
          setSelectedApplication(null);
          setSelectedInterviews([]);
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Error fetching applications");
    } finally {
      setIsLoading(false);
    }
};


  const updateCandidateStatus = async (applicationId, round) => {
     const confirmation = window.confirm(
      "Are you sure you want to update the candidate status for this interview round?"
    );
    if (!confirmation) {
      return;
    }
    if (!applicationId) {
      alert("Cannot update candidate: Invalid application ID");
      return;
    }

    try {
      const response = await axios.put(
        `${API}/application/${applicationId}/interview/${round}/update-candidate`,
        { updateCandidate: true }
      );
      if (response.status === 200) {
        alert("Candidate status updated successfully");
        await fetchApplications();
        setShowInterviewHistory(false);

      }
    } catch (error) {
      alert("Error updating candidate status: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const updateFeedback = async (applicationId, round, feedback) => {
    const confirmation = window.confirm(
      "Are you sure you want to update the feedback for this interview round?"
    );
    if (!confirmation) {
      return;
    }
    if (!applicationId || !feedback) {
      alert("No feedback available to update");
      return;
    }

    try {
      const response = await axios.put(
        `${API}/application/${applicationId}/interview/${round}/update-feedback`,
        { feedback, feedbackUpdatedByHR: true }
      );
      if (response.status === 200) {
        alert("Feedback updated successfully");
        await fetchApplications();
        setShowInterviewHistory(false);
      }
    } catch (error) {
      alert("Error updating feedback: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const updateInterviewStatus = async (applicationId) => {
    const confirmation = window.confirm(
      "Are you sure you want to update the interview status for this application?"
    );
    if (!confirmation) {
      return;
    }
    if (!applicationId || !selectedApplication) {
      alert("Cannot update status: Invalid application");
      return;
    }

    try {
      const response = await axios.put(
        `${API}/application/${applicationId}/update-interview-status`
      );
      if (response.status === 200) {
        alert("Interview status updated successfully");
        await fetchApplications();
        setShowInterviewHistory(false);
      }
    } catch (error) {
      alert(`Error updating interview status: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [hrId]);

  return (
    <div id="interviewProcess">
      {isLoading && <div>Loading...</div>}
      <div className="heading">
        <h2 className="job-list-title">Interview Applications</h2>
      </div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Candidate Name</th>
            <th className="header-cell">Applied for Designation</th>
            <th className="header-cell">Applied on</th>
            <th className="header-cell">Company Name</th>
            <th className="header-cell">Company Status</th>
            <th className="header-cell">Interview Details</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {applications.length === 0 ? (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="6">
                No applications with interviews found
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id} className="table-row">
                <td className="table-cell">
                  {app.resumeId?.personalInfo?.name ||
                    app.userId?.name ||
                    "Unknown Candidate"}
                </td>
                <td className="table-cell">
                  {app.jobId?.jobTitle || "Unknown Position"}
                </td>
                <td className="table-cell">
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "Unknown Date"}
                </td>
                <td className="table-cell">
                  {app.jobId?.company?.companyName || "Unknown Company"}
                </td>
                <td className="table-cell">
                  {app.companyStatus && app.companyStatus !== "null"
                    ? app.companyStatus
                    : "Pending"}
                </td>
                <td className="table-cell cursor-pointer">
                  {app.interviews?.length || 0}{" "}
                  {app.interviews?.length > 0 && (
                    <i
                      className="fa fa-history interview-rounds-icon"
                      title="View Past Interviews"
                      onClick={() => {
                        if (!app.interviews?.length || !app._id) {
                          console.error("No interviews or invalid application ID:", app._id);
                          return;
                        }
                        setSelectedInterviews(app.interviews);
                        setSelectedApplication(app);
                        setShowInterviewHistory(true);
                      }}
                    ></i>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showInterviewHistory && selectedApplication && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => {
                setShowInterviewHistory(false);
                setSelectedApplication(null);
              }}
            >
              ×
            </span>
            <h2>Interview Updates</h2>
            {selectedInterviews.map((interview, idx) => (
              <div key={idx} className="interview-round">
                <h3>Round {interview.round}</h3>
                <p>
                  <strong>Date:</strong>{" "}
                  {interview.date
                    ? new Date(interview.date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Mode:</strong> {interview.mode || "N/A"}
                </p>
                <p>
                  <strong>Interviewer:</strong> {interview.interviewer || "N/A"}
                </p>
                <p>
                  <strong>Link:</strong>{" "}
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
                  <strong>Interview is:</strong>{" "}
                  {interview.updateCandidate ? "Updated" : "Not Updated to Candidate"}
                </p>
                {!interview.updateCandidate && (
                  <button
                  className="update-candidate-button"
                    onClick={() =>
                      updateCandidateStatus(selectedApplication._id, interview.round)
                    }
                  >
                    Update Candidate
                  </button>
                )}
                <p>
                  <strong>Feedback:</strong>{" "}
                  {interview.interviewStatus || "No status provided"}
                </p>
                {interview.interviewStatus && !interview.feedbackUpdatedByHR && (
                  <button
                   className="update-candidate-button"
                    onClick={() =>
                      updateFeedback(
                        selectedApplication._id,
                        interview.round,
                        interview.interviewStatus
                      )
                    }
                  >
                    Update Feedback
                  </button>
                )}
               
                <p>
                  <strong>Feedback Updated:</strong>{" "}
                  {interview.feedbackUpdatedByHR ? "Yes" : "No"}
                </p>
              </div>
            ))}
            <p>
              <strong>Overall Interview Status:</strong>{" "}
              {selectedApplication.interviewOverviewStatus?.toLowerCase() === "rejected"
                ? "Rejected"
                : selectedApplication.shortListed
                ? "Shortlisted"
                : "Pending"}
            </p>
            <button
             className="update-candidate-button"
              onClick={() => updateInterviewStatus(selectedApplication._id)}
            >
              Update Interview Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewProcess;