import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const SelectedCandidates = () => {
  const [applications, setApplications] = useState([]);
  const hrId = localStorage.getItem("HrId");

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API}/hr-applications/${hrId}`);
      const filteredApplications = response.data.filter(
        (app) => app.status.toLowerCase() === "selected" && app.hrId === hrId
      );
      setApplications(filteredApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };


  useEffect(() => {
    if (hrId) {
      fetchApplications();
    }
  }, [hrId]);

  return (
    <div id="rejected-applications">
      <div className="application-container">
        <h2 className="application-title">Selected Job Applications</h2>
        <table className="application-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Candidate Name</th>
              <th>Status</th>
              <th>Company Name</th>
              <th>Company Status</th>
              <th>shortListed</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr className="no-applications">
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Selected Applications Found
                </td>
              </tr>
            ) : (
              applications.map((application, index) => (
                <tr key={application._id}>
                  <td>{index + 1}</td>
                  <td>{application.resumeId.personalInfo.name}</td>
                  <td>{application.status}</td>
                  <td>{application.jobId.company?.companyName}</td>
                  <td>{application.companyStatus}</td>
                  <td>{application.shortListed ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectedCandidates;
