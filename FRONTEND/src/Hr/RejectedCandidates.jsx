import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const RejectedCandidates = () => {
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hrId = localStorage.getItem("HrId");

  const fetchRejectedApplications = async () => {
    try {
      if (!hrId) {
        setError("No HrId found, cannot fetch applications");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API}/rejected-applications/${hrId}`);
      setRejectedApplications(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch rejected applications");
      setLoading(false);
      console.error("Error fetching rejected applications:", error);
      alert("Failed to fetch rejected applications. Please try again.");
    }
  };



  const closeModal = () => {
    setSelectedResume(null);
    setSelectedJobDescription(null);
   
   
  };

  useEffect(() => {
    if (hrId) {
      fetchRejectedApplications();
    } else {
      setError("No HrId found, cannot fetch applications");
      setLoading(false);
    }
  }, [hrId]);

  return (
    <div id="rejected-candidates">
      <div className="container">
        <h2 className="title">Rejected Candidate Applications</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Candidate Name</th>
                <th>Company Name</th>
                <th>Designation</th>
                <th>Applied On</th>
                <th>Desired Skills</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rejectedApplications.length === 0 ? (
                <tr >
                  <td style={{ textAlign:"center"}} colSpan="7">No rejected applications found.</td>
                </tr>
              ) : (
                rejectedApplications.map((app, index) => (
                  <tr key={app._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      {app.resumeId?.personalInfo?.name ||
                        app.userId?.name ||
                        "N/A"}
                    </td>
                    <td>
                      {app.jobId?.company?.companyName ||
                        app.jobId?.companyId?.companyName ||
                        "N/A"}
                    </td>
                    <td>{app.jobId?.jobTitle || "N/A"}</td>
                    <td>
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{app.jobId?.desiredSkills || "N/A"}</td>
                    <td>
                      {app.interviewOverviewStatus?.toLowerCase() === "rejected"
                        ? "Interview Rejected"
                        : app.status?.toLowerCase() === "rejected"
                        ? "HR Rejected"
                        : app.companyStatus?.toLowerCase() === "rejected"
                        ? "Company Rejected"
                        : "N/A"}
                    </td>
                
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RejectedCandidates;