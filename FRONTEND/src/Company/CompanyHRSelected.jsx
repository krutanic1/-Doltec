import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const CompanyHRSelected = () => {
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const companyId = localStorage.getItem("companyId");

  const fetchSelectedApplications = async () => {
    try {
      if (!companyId) {
        return;
      }
      const response = await axios.get(
        `${API}/selected-applications/${companyId}`
      );
      setSelectedApplications(
        response.data?.filter(
          (item) => item && item.companyStatus === "pending"
        )
      );
      // console.log("Fetched selected applications:", response.data);
    } catch (error) {
      alert("Failed to fetch applications. Please try again.");
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

  const handleApplicationStatus = async (app, status) => {
    const confirm = window.confirm(
      `Are you sure you want to ${status} this condidate`
    );
    if (confirm) {
      try {
        const response = await axios.put(
          `${API}/application/${app._id}/companyStatus`,
          {
            status,
          }
        );
        if (response.status === 200) {
          const message =
            status === "Selected"
              ? "Moved to Next Round, Check Interview Process Tab"
              : "Application Rejected";
          alert(message);
          setSelectedApplications((prevApplications) =>
            prevApplications.filter(
              (application) => application._id !== app._id
            )
          );
        }
      } catch (error) {
        alert(`Failed to update application to ${status}. Please try again.`);
      }
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchSelectedApplications();
    } else {
      console.error("No companyId found, cannot fetch applications");
    }
  }, [companyId]);

  return (
    <div id="companyHRSelected">
      <div className="heading">
        <h2 className="job-list-title">HR Selected Candidate Applications</h2>
      </div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Candidate Name</th>
            <th className="header-cell">Candidate Resume</th>
            <th className="header-cell">Applied for Designation</th>
            <th className="header-cell">Applied on</th>
            <th className="header-cell">HR Status</th>
            <th className="header-cell">Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {selectedApplications.length === 0 ? (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="7">
                No selected candidates found
              </td>
            </tr>
          ) : (
            selectedApplications.map((app, index) => (
              <tr className="jobs-row" key={index}>
                <td className="table-cell">
                  {app.resumeId?.personalInfo?.name ||
                    app.userId?.name ||
                    "N/A"}
                </td>
                <td className="table-cell">
                  <i
                    className="fa fa-file-pdf-o"
                    onClick={() => handleViewResume(app.resumeId)}
                    style={{ cursor: "pointer", color: "red" }}
                  ></i>
                </td>
                <td className="table-cell">{app.jobId?.jobTitle || "N/A"}</td>
                <td className="table-cell">
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="table-cell">{app.status || "N/A"}</td>
                <td className="table-cell">
                  <button
                    className="action-button"
                    onClick={() => handleApplicationStatus(app, "Selected")}
                  >
                    Move to Next Round
                  </button>
                  <button
                    title="Reject"
                    className="action-button"
                    onClick={() => handleApplicationStatus(app, "Rejected")}
                  >
                    <i class="fa fa-close"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {selectedResume && (
        <div className="modal">
          <div className="modal-content">
            <div className="head">
              <h2>Resume Details</h2>
              <span onClick={closeModal}>x</span>
            </div>
            <div>
              <hr />
              <h3>Personal Info</h3>
              <p>Name: {selectedResume.personalInfo?.name || "N/A"}</p>
              <p>Email: {selectedResume.personalInfo?.email || "N/A"}</p>
              <p>Phone: {selectedResume.personalInfo?.phone || "N/A"}</p>
            </div>
            <div>
              <hr />
              <h3>Professional Summary</h3>
              <pre style={
                {whiteSpace: "pre-wrap",
                wordWrap: "break-word",}
              }>
                {selectedResume.summary || "No professional summary provided"}
              </pre>
            </div>
            <div>
              <hr />
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
              <hr />
              <h3>Experience</h3>
              <p>Company Name: {selectedResume.experience?.company || "N/A"}</p>
              <p>Role: {selectedResume.experience?.role || "N/A"}</p>
              <p>Duration: {selectedResume.experience?.duration || "N/A"}</p>
            </div>
            <div>
              <hr />
              <h3>Skills</h3>
              <p>
                {Array.isArray(selectedResume.skills)
                  ? selectedResume.skills.join(", ")
                  : typeof selectedResume.skills === "string"
                  ? selectedResume.skills
                  : "No skills provided"}
              </p>
            </div>
            <div>
              <hr />
              <h3>Projects</h3>
              {selectedResume.project ? (
                <pre style={
                  {whiteSpace: "pre-wrap",
                  wordWrap: "break-word",}
                }>
                  {selectedResume.project}
                </pre>
              ) : (
                <p>No project details provided</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyHRSelected;
