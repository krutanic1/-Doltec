import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedJobDescription, setSelectedJobDescription] = useState(null);
  const hrId = localStorage.getItem("HrId");

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API}/hr-applications/${hrId}`);
      const filteredApplications = response?.data?.filter(
        (app) => app.status.toLowerCase() === "pending" && app.hrId === hrId
      );
      setApplications(filteredApplications);
      // console.log("Filtered Applications:", filteredApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
  };

  const handleViewJobDescription = (description) => {
    setSelectedJobDescription(description);
  };

  const HandleApplication = async (application, status) => {
    const conformation = window.confirm(
      `Are you sure you want to mark this application as ${status}?`
    );
    if (!conformation) {
      return;
    }
    try {
      await axios.put(`${API}/application/${application._id}/status`, {
        status: status,
      });
      fetchApplications();
     
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  useEffect(() => {
    if (hrId) {
      fetchApplications();
    }
  }, [hrId]);

  return (
    <div id="jobapplications">
      <div className="application-container">
        <h2 className="application-title">Job Applications</h2>
        <table className="application-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Candidate Name</th>
              <th>Resume</th>
              <th>Company Name</th>
              <th>Company Required Skills</th>
              <th>Company Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="8">No pending applications found.</td>
              </tr>
            ) : (
              applications.map((application, index) => (
                <tr key={application._id}>
                  <td>{index + 1}</td>
                  <td>{application.resumeId.personalInfo.name}</td>
                  <td>
                    <i
                      class="fa fa-file-pdf-o"
                      title="View Resume"
                      onClick={() => handleViewResume(application.resumeId)}
                      style={{ cursor: "pointer", color: "red" }}
                    ></i>
                  </td>
                  <td>{application.jobId.company?.companyName}</td>
                  <td>{application.jobId.desiredSkills}</td>
                  <td>
                    <i
                      className="fa fa-info-circle"
                      title="Discription"
                      onClick={() => handleViewJobDescription(application.jobId.jobDescription)}
                      style={{ cursor: "pointer", color: "#007bff" }}
                    ></i>
                  </td>
                  <td>
                    <button
                      className="accept-button"
                      onClick={() => HandleApplication(application, "selected")}
                    >
                      Select
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => HandleApplication(application, "rejected")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {selectedResume && (
           <div className="resume__container">
             <div className="resume-details">
              <div className="resume__heading">
              <h3>Resume Details</h3>
              <button className="resume-close-button" onClick={() => setSelectedResume(null)}>X</button>
              </div>
            <div className="resume-section">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {selectedResume.personalInfo.name}</p>
              <p><strong>Email:</strong> {selectedResume.personalInfo.email}</p>
              <p><strong>Phone:</strong> {selectedResume.personalInfo.phone}</p>
              <p><strong>Address:</strong> {selectedResume.personalInfo.address}</p>
            </div>
             <div className="resume-section">
              <h4>Professional Summary</h4>
              <pre>{selectedResume.summary}</pre>
            </div>
            <div className="resume-section">
              <h4>Skills</h4>
              <p>{selectedResume.skills}</p>
            </div>
            <div className="resume-section">
              <h4>Education</h4>
              {selectedResume.educations.map((edu, index) => (
                <div key={index} className="education-entry">
                  <p><strong>Institute:</strong> {edu.institute}</p>
                  <p><strong>Degree:</strong> {edu.degree}</p>
                  <p><strong>Year:</strong> {edu.year}</p>
                </div>
              ))}
            </div>
            <div className="resume-section">
              <h4>Experience</h4>
              <div className="experience-entry">
                <p><strong>Company:</strong> {selectedResume.experience.company}</p>
                <p><strong>Role:</strong> {selectedResume.experience.role}</p>
                <p><strong>Duration:</strong> {selectedResume.experience.duration}</p>
              </div>
            </div>
            <div className="resume-section">
              <h4>Project</h4>
              <pre>{selectedResume.project}</pre>
            </div>
             </div>
           </div>
        )}
        {selectedJobDescription && (
          <div className="job-description-dialog">
             <div className="heading">
             <h3>Job Description</h3>
            <button
              className="job-description-close-button" onClick={() => setSelectedJobDescription(null)}>
              X
            </button>
             </div>
            <pre>{selectedJobDescription}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
