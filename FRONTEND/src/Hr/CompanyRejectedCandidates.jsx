import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const CompanyRejectedCandidates = () => {
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const HrId = localStorage.getItem("HrId");

  const fetchRejectedApplications = async () => {
    try {
      if (!HrId) {
        console.error("No HrId found, cannot fetch applications");
        return;
      }
      const response = await axios.get(
        `${API}/rejected-applications/${HrId}`
      );
      setRejectedApplications(response.data);
    } catch (error) {
      alert("Failed to fetch rejected applications. Please try again.");
    }
  };
  const handleViewResume = (resume) => {
    if (resume) {
      setSelectedResume(resume);
    } else {
      console.error("No resume provided to handleViewResume");
    }
  };
  const closeModal = () => {
    setSelectedResume(null);
  };
  useEffect(() => {
    if (HrId) {
      fetchRejectedApplications();
    } else {
      console.error("No HrId found, cannot fetch applications");
    }
  }, [HrId]);

  return (
    <div id="companyRejectedCandidates">
      <div className="heading">
        <h2 className="job-list-title">Rejected Candidate Applications</h2>
      </div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Candidate Name</th>
            <th className="header-cell">Candidate Resume</th>
            <th className="header-cell">Applied for Designation</th>
            <th className="header-cell">Applied on</th>
            <th className="header-cell">Company Name</th>
            <th className="header-cell">Company Status</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {rejectedApplications.length === 0 ? (
            <tr className="no-jobs-row">
              <td style={{textAlign:"center"}} className="no-jobs-cell" colSpan="6">
                No rejected candidates found
              </td>
            </tr>
          ) : (
            rejectedApplications.map((app, index) => (
              <tr key={index}>
                <td className="table-cell">
                  {app.resumeId?.personalInfo?.name ||
                    app.userId?.name ||
                    "N/A"}
                </td>
                <td className="table-cell">
                  <i
                    className="fa fa-eye"
                    onClick={() => handleViewResume(app.resumeId)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  ></i>
                </td>
                <td className="table-cell">{app.jobId?.jobTitle || "N/A"}</td>
                <td className="table-cell">
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="table-cell">
                  {app.jobId?.companyId?.companyName || "N/A"}
                </td>
                <td className="table-cell">{app.companyStatus || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedResume && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              x
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
              {selectedResume.educations?.length > 0 ? (
                selectedResume.educations.map((edu, idx) => (
                  <p key={idx}>
                    {edu.degree} - {edu.institute} ({edu.year})
                  </p>
                ))
              ) : (
                <p>No education details provided</p>
              )}
            </div>
            <div>
              <h3>Experience</h3>
              <p>Company Name: {selectedResume.experience?.company || "N/A"}</p>
              <p>Role: {selectedResume.experience?.role || "N/A"}</p>
              <p>Duration: {selectedResume.experience?.duration || "N/A"}</p>
            </div>
            <div>
              <h3>Skills</h3>
              <p>
                {Array.isArray(selectedResume.skills)
                  ? selectedResume.skills.join(", ")
                  : typeof selectedResume.skills === "string"
                  ? selectedResume.skills
                  : "No skills provided"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyRejectedCandidates;