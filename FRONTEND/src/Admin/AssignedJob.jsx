import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../API'

const AssignedJob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHr, setSelectedHr] = useState(null);
  const [groupedJobs, setGroupedJobs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await axios.get(`${API}/company-all-jobs`, {
        });
        const assignedJobs = jobs.data.filter(
          (job) => job.hrId && job.hrId !== ''
        );
        // Group filtered jobs by hrName
        const grouped = assignedJobs.reduce((acc, job) => {
          const hr = job.hrName || 'Unknown';
          if (!acc[hr]) acc[hr] = [];
          acc[hr].push(job);
          return acc;
        }, {});
        setJobs(assignedJobs);
        setGroupedJobs(grouped);
        setLoading(false);
      } catch (err) {
        console.log('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Aggregate job data for summary table
  const hrSummary = Object.keys(groupedJobs).map((hr) => ({
    hrName: hr,
    location: groupedJobs[hr][0]?.location || 'N/A',
    jobCount: groupedJobs[hr].length,
    totalPositions: groupedJobs[hr].reduce(
      (sum, job) => sum + (job.noofposition || 0),
      0
    ),
  }));
  const handleJobCountClick = (hrName) => {
    setSelectedHr(hrName);
    setIsDialogOpen(true);
  };

  return (
    <div id="assigned-job">
       <div className="assigned__container">
       <h2 className="job-title">Assigned Jobs</h2>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">HR Name</th>
            <th className="header-cell">No of Jobs</th>
            <th className="header-cell">Total Positions</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {loading ? (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="5">
                Loading jobs...
              </td>
            </tr>
          ) : hrSummary.length > 0 ? (
            hrSummary.map((hr, index) => (
              <tr key={index} className="job-row">
                <td className="job-cell">{hr.hrName}</td>
                <td
                  className="job-cell job-count-cell"
                  onClick={() => handleJobCountClick(hr.hrName)}
                >
                  {hr.jobCount}
                </td>
                <td className="job-cell">{hr.totalPositions}</td>
              </tr>
            ))
          ) : (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="5">
                No jobs assigned
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isDialogOpen && selectedHr && groupedJobs[selectedHr] && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h2 className="dialog-title">Jobs Assigned to {selectedHr}</h2>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedHr(null);
                }}
                className="dialog-close"
              >
                x
              </button>
            </div>
            <div className="dialog-content">
              <table className="dialog-table">
                <thead className="dialog-table-header">
                  <tr className="dialog-header-row">
                  <th className="dialog-header-cell">Company Name</th>
                    <th className="dialog-header-cell">Job Title</th>
                    <th className="dialog-header-cell">Location</th>
                    <th className="dialog-header-cell">Positions</th>
                    <th className="dialog-header-cell">Experience</th>
                    <th className="dialog-header-cell">Application Deadline</th>
                    
                  </tr>
                </thead>
                <tbody className="dialog-table-body">
                  {groupedJobs[selectedHr].map((job, index) => (
                    <tr key={index} className="dialog-job-row">
                        <td className="dialog-job-cell">
                        {job.companyName || 'N/A'}
                      </td>
                      <td className="dialog-job-cell">{job.jobTitle || 'N/A'}</td>
                      <td className="dialog-job-cell">{job.location || 'N/A'}</td>
                      <td className="dialog-job-cell">
                        {job.noofposition || 'N/A'}
                      </td>
                      <td className="dialog-job-cell">{job.experience || 'N/A'}</td>
                      <td className="dialog-job-cell">
                        {job.applicationDeadline
                          ? new Date(job.applicationDeadline).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
       </div>
    </div>
  );
};

export default AssignedJob;