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
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Assigned Jobs
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Overview of jobs assigned to HR personnel.</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>HR Name</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>No of Jobs</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Total Positions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: "24px", marginBottom: "10px" }}><i className="fa fa-spinner fa-spin"></i></div>
                      <p>Loading jobs...</p>
                    </td>
                  </tr>
                ) : hrSummary.length > 0 ? (
                  hrSummary.map((hr, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{hr.hrName}</td>
                      <td 
                        onClick={() => handleJobCountClick(hr.hrName)}
                        style={{ padding: "20px", color: "#3b82f6", fontSize: "15px", fontWeight: "600", textAlign: "center", cursor: "pointer", textDecoration: "underline" }}
                      >
                        {hr.jobCount}
                      </td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "15px", fontWeight: "500", textAlign: "center" }}>{hr.totalPositions}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>📋</div>
                      <p>No jobs assigned.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Job Details */}
        {isDialogOpen && selectedHr && groupedJobs[selectedHr] && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", width: "95%", maxWidth: "1000px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>Jobs Assigned to <span style={{ color: "#3b82f6" }}>{selectedHr}</span></h3>
                <button 
                  onClick={() => { setIsDialogOpen(false); setSelectedHr(null); }} 
                  style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", transition: "background-color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  &times;
                </button>
              </div>
              
              <div style={{ padding: "24px", overflowY: "auto" }}>
                <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Company Name</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Title</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Location</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Positions</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Experience</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedJobs[selectedHr].map((job, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "12px 16px", fontWeight: "500", color: "#0f172a", fontSize: "14px" }}>{job.companyName || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>{job.jobTitle || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>{job.location || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#0f172a", fontSize: "14px", fontWeight: "600", textAlign: "center" }}>
                            <span style={{ backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: "10px", fontSize: "12px" }}>{job.noofposition || 'N/A'}</span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>{job.experience || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>
                            {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedJob;