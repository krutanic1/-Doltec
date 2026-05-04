import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const CompanyJoblist = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const hrId = localStorage.getItem("HrId");

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API}/company-all-jobs`);
      console.log(data);
      const filteredJobs = data.filter(job => job.assignedToHr && job.hrId === hrId);
      setJobs(filteredJobs);
    } catch {
      setError("Error fetching jobs.");
    }
  };

  useEffect(() => {
    if (hrId) fetchJobs();
    else setError("No HR ID found.");
  }, [hrId]);

  return (
    <div id="hrcompanyjoblist">
      <div className="job-container">
      <h2 className="job-title">Job Listings</h2>
        {error && <div className="error-message">{error}</div>}
        <table className="job-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Company Nam</th>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length ? (
              jobs.map((job, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{job.companyName || "N/A"}</td>
                  <td>{job.jobTitle || "N/A"}</td>
                  <td>{job.location || "N/A"}</td>
                  <td>{job.jobType || "N/A"}</td>
                  <td>
                    {job.applicationDeadline
                      ? new Date(job.applicationDeadline).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No jobs assigned</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyJoblist;