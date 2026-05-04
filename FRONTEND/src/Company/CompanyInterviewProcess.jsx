import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const CompanyInterviewProcess = () => {
  const [interviewApplications, setInterviewApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [formData, setFormData] = useState({});
  const [feedbackMode, setFeedbackMode] = useState({});
  const [showInterviewHistory, setShowInterviewHistory] = useState(false);
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const companyId = localStorage.getItem("companyId");

  const fetchInterviewApplications = async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/interview-applications/${companyId}`);
      const filteredApps = response.data.filter(app => !app.shortListed);
      setInterviewApplications(filteredApps);
      response.data.forEach(app => {
        if (app.interviews?.length) {
         
        }
      });
    } catch (error) {
      alert("Error fetching interview applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (appId, action, data = {}) => {
     const confirm = window.confirm(`Are you sure you want to ${action} this application?`);
    if (!confirm) return;
    setIsLoading(true);
    try {
      if (action === "reject") {
        await axios.put(`${API}/interview-application/${appId}/companyStatus`, { status: "Rejected" });
        setInterviewApplications(prev => prev.filter(app => app._id !== appId));
        alert("Application rejected and moved to HR");
      
      } else if (action === "shortlist") {
        const previousApps = interviewApplications;
        setInterviewApplications(prev =>
          prev.map(app =>
            app._id === appId ? { ...app, shortListed: true } : app
          )
        );
        setInterviewApplications(prev => prev.filter(app => app._id !== appId));
        try {
          await axios.put(`${API}/application/${appId}/companyStatus`, { shortListed: true });
          alert("Application shortlisted and moved to HR");
        } catch (error) {
          setInterviewApplications(previousApps);
          throw error;
        }
      } else if (action === "schedule") {
        if (!data.date || !data.mode) {
          alert("Please provide interview date and mode");
          return;
        }
        const response = await axios.put(`${API}/company-application/${appId}/interview`, data);
        setFeedbackMode(prev => ({ ...prev, [appId]: true }));
        alert("Interview scheduled successfully");
        fetchInterviewApplications();
      } else if (action === "feedback") {
        if (!data.interviewStatus) {
          alert("Please select an interview status");
          return;
        }
        const app = interviewApplications.find(app => app._id === appId);
        if (!app?.interviews?.length) {
          alert("No interview found for status update");
          return;
        }
        const latestInterviewId = app.interviews[app.interviews.length - 1]._id;
        await axios.put(`${API}/company-application/${appId}/interview/${latestInterviewId}/feedback`, {
          interviewStatus: data.interviewStatus,
        });
        setFormData(prev => ({ ...prev, [appId]: {} }));
        setFeedbackMode(prev => ({ ...prev, [appId]: false }));
        alert("Interview feedback submitted successfully");
        fetchInterviewApplications();
      }
    } catch (error) {
      alert(error.response?.data?.message || `Error during ${action}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e, appId) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [appId]: { ...prev[appId], [name]: value } }));
  };

  useEffect(() => {
    if (companyId) fetchInterviewApplications();
  }, [companyId]);

  const hasPendingFeedback = (app) => {
    if (!app.interviews || app.interviews.length === 0) return false;
    const latestInterview = app.interviews[app.interviews.length - 1];
    return (
      latestInterview.interviewStatus == null ||
      latestInterview.interviewStatus === "" ||
      latestInterview.interviewStatus === "Pending"
    );
  };

  return (
    <div id="CompanyInterviewProcess">
      {isLoading && <div>Loading...</div>}
      <div className="heading">
        <h2 className="job-list-title">Interview Process Candidates</h2>
      </div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Candidate Name</th>
            <th className="header-cell">Resume</th>
            <th className="header-cell">Designation</th>
            <th className="header-cell">Applied On</th>
            <th className="header-cell">HR Name</th>
            <th className="header-cell">Status</th>
            <th className="header-cell">Interview Rounds</th>
            <th className="header-cell">Actions</th>
            <th className="header-cell">Interview</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {interviewApplications.length === 0 ? (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="9">No candidates in interview process</td>
            </tr>
          ) : (
            interviewApplications.map((app, index) => (
              <tr key={index} className="job-row">
                <td className="job-cell">{app.resumeId?.personalInfo?.name || app.userId?.name || "N/A"}</td>
                <td className="job-cell">
                  <i className="fas fa-eye" onClick={() => setSelectedResume(app.resumeId)}></i>
                </td>
                <td className="job-cell">{app.jobId?.jobTitle || "N/A"}</td>
                <td className="job-cell">{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}</td>
                <td className="job-cell">{app.jobId?.hrName || "Unknown HR"}</td>
                <td className="job-cell">HR {app.companyStatus || "N/A"}</td>
                <td className="job-cell">
                  {app.interviews?.length || 0}
                  {app.interviews?.length > 0 && (
                    <i
                      className="fa fa-history interview-rounds-icon"
                      title="View Past Interviews"
                      onClick={() => {
                        if (!app.interviews?.length) {
                          console.log("No interview history");
                          return;
                        }
                        setSelectedInterviews(app.interviews);
                        setShowInterviewHistory(true);
                      }}
                    ></i>
                  )}
                </td>
                <td className="job-cell">
                  <button
                    className="action-button"
                    onClick={() => handleAction(app._id, "reject")}
                    disabled={isLoading}
                  >
                    Reject
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleAction(app._id, "shortlist")}
                    disabled={app.shortListed || isLoading}
                  >
                    {app.shortListed ? "Shortlisted" : "Shortlist"}
                  </button>
                </td>
                <td className="job-cell">
                  {(feedbackMode[app._id] || hasPendingFeedback(app)) ? (
                    <>
                      <select
                        name="interviewStatus"
                        value={formData[app._id]?.interviewStatus || ""}
                        onChange={e => handleInput(e, app._id)}
                        className="interview-status-select"
                        disabled={isLoading}
                      >
                        <option value="">Select Status</option>
                        <option value="Move to Next Round">Move to Next Round</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        className="action-button update-button"
                        onClick={() => handleAction(app._id, "feedback", formData[app._id])}
                        disabled={isLoading}
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <>
                      <form  onSubmit={() => handleAction(app._id, "schedule", formData[app._id])}>
                        <input
                        type="date"
                        name="date"
                        required
                        value={formData[app._id]?.date || ""}
                        onChange={e => handleInput(e, app._id)}
                        disabled={isLoading}
                      />
                      <select
                        name="mode"
                        required
                        value={formData[app._id]?.mode || ""}
                        onChange={e => handleInput(e, app._id)}
                        disabled={isLoading}
                      >
                        <option value="">Mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Phone">Phone</option>
                      </select>
                      <input
                        type="text"
                        required
                        name="link"
                        placeholder="Meeting Link / Venue"
                        value={formData[app._id]?.link || ""}
                        onChange={e => handleInput(e, app._id)}
                        disabled={isLoading}
                      />
                      <input
                        type="text"
                        required
                        name="interviewer"
                        placeholder="Interviewer Name"
                        value={formData[app._id]?.interviewer || ""}
                        onChange={e => handleInput(e, app._id)}
                        disabled={isLoading}
                      />
                      <button
                        className="action-button schedule-button"
                       
                        disabled={isLoading}
                      >
                        Schedule
                      </button>
                      </form>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedResume && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setSelectedResume(null)}>
              ×
            </span>
            <h2>Resume Details</h2>
            <div>
              <h3>Personal Info</h3>
              <p>Name: {selectedResume.personalInfo?.name || "N/A"}</p>
              <p>Email: {selectedResume.personalInfo?.email || "N/A"}</p>
              <p>Phone: {selectedResume.personalInfo?.phone || "N/A"}</p>
            </div>
            <div>
              <h3>Education</h3>
              {selectedResume.educations?.length ? (
                selectedResume.educations.map((edu, idx) => (
                  <p key={idx}>
                    {edu.degree} - {edu.institute} ({edu.year})
                  </p>
                ))
              ) : (
                <p>No education details</p>
              )}
            </div>
            <div>
              <h3>Experience</h3>
              <p>Company: {selectedResume.experience?.company || "N/A"}</p>
              <p>Role: {selectedResume.experience?.role || "N/A"}</p>
              <p>Duration: {selectedResume.experience?.duration || "N/A"}</p>
            </div>
            <div>
              <h3>Skills</h3>
              <p>
                {Array.isArray(selectedResume.skills)
                  ? selectedResume.skills.join(", ")
                  : selectedResume.skills || "No skills"}
              </p>
            </div>
          </div>
        </div>
      )}
      {showInterviewHistory && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowInterviewHistory(false)}>
              ×
            </span>
            <h2>Interview History</h2>
            {selectedInterviews.map((interview, idx) => (
              <div key={idx} className="interview-round">
                <h3>Round {interview.round}</h3>
                <p>
                  <strong>Date:</strong>{" "}
                  {interview.date ? new Date(interview.date).toLocaleDateString() : "N/A"}
                </p>
                <p>
                  <strong>Mode:</strong> {interview.mode || "N/A"}
                </p>
                <p>
                  <strong>Interviewer:</strong> {interview.interviewer || "N/A"}
                </p>
                <p>
                  <strong>Link:</strong> {interview.link || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {interview.interviewStatus || "No status provided"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInterviewProcess;