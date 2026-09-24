import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../API';

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  // const [companies, setCompanies] = useState([]); 
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hr, setHr] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API}/company-all-jobs`);
        setJobs(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchHr = async () => {
      try {
        const response = await axios.get(`${API}/gethr`);
        setHr(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    // const fetchCompanies = async () => {
    //   try {
    //     const response = await axios.get(`${API}/companies`);
    //     setCompanies(response.data);
    //     console.log("Affan",response.data);
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // };
    fetchJobs();
    fetchHr();
    // fetchCompanies();
  }, []);

  const handleAssignJob = async (jobId, hrId) => {
    if (!hrId) {
      alert('Please select an HR to assign the job.');
      return;
    }
    try {
      const response = await axios.post(`${API}/assign-to-hr`, { jobId, hrId });
      alert(response.data.message);
      const updatedJobs = await axios.get(`${API}/company-all-jobs`);
      setJobs(updatedJobs.data);
    } catch (error) {
      alert('Failed to assign job: ' + error.response?.data?.message || error.message);
    }
  };

  // const handleAddJobLimit = async (companyId) => {
  //   try {
  //     const response = await axios.post(`${API}/increment-job-limit`, { companyId });
  //     alert(response.data.message);
  //     const updatedCompanies = await axios.get(`${API}/companies`);
  //     setCompanies(updatedCompanies.data);
  //   } catch (error) {
  //     alert('Failed to update job limit: ' + error.response?.data?.message || error.message);
  //   }
  // };

  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.companyName]) {
      acc[job.companyName] = [];
    }
    acc[job.companyName].push(job);
    return acc; 
  }, {});
  
  const companyList = Object.keys(groupedJobs).map(companyName => {
    const jobsForCompany = groupedJobs[companyName];
    const experienceRange = jobsForCompany.length > 0
      ? (() => {
          const minYears = Math.min(...jobsForCompany.map(job => {
            const min = job.experience ? parseInt(job.experience.split('-')[0] || 0, 10) : 0;
            return isNaN(min) ? 0 : min;
          }));
          const maxYears = Math.max(...jobsForCompany.map(job => {
            const max = job.experience ? parseInt(job.experience.split('-')[1] || 0, 10) : 0;
            return isNaN(max) ? 0 : max;
          }));
          return `${minYears}-${maxYears} years`;
        })()
      : 'N/A';
    return {
      companyName,
      // companyId: companyData?.companyId || 'N/A',
      jobCount: jobsForCompany.length,
      location: jobsForCompany[0]?.location || 'N/A',
      totalPositions: jobsForCompany.reduce((sum, job) => sum + (job.noofposition || 0), 0),
      experienceRange,
    };
  });

  const handleJobCountClick = (companyName) => {
    if (groupedJobs[companyName]) {
      setSelectedCompany(companyName);
      setIsDialogOpen(true);
    } else {
      console.error('No jobs found for company:', companyName);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Company Job List
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Overview of jobs posted by onboarded companies.</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Company Name</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Location</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>No of Jobs</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Total Positions</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Experience Range</th>
                </tr>
              </thead>
              <tbody>
                {companyList.length > 0 ? (
                  companyList.map((company, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{company.companyName}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{company.location}</td>
                      <td 
                        onClick={() => handleJobCountClick(company.companyName)}
                        style={{ padding: "20px", color: "#3b82f6", fontSize: "15px", fontWeight: "600", textAlign: "center", cursor: "pointer", textDecoration: "underline" }}
                      >
                        {company.jobCount}
                      </td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "15px", fontWeight: "500", textAlign: "center" }}>{company.totalPositions}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{company.experienceRange}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏢</div>
                      <p>No company jobs available.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Job Details & Assigning HR */}
        {isDialogOpen && selectedCompany && groupedJobs[selectedCompany] && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", width: "95%", maxWidth: "1000px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>Jobs at <span style={{ color: "#3b82f6" }}>{selectedCompany}</span></h3>
                <button 
                  onClick={() => { setIsDialogOpen(false); setSelectedCompany(null); }} 
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
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Title</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Location</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Positions</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Experience</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Deadline</th>
                        <th style={{ padding: "12px 16px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assign HR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedJobs[selectedCompany].map((job, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "12px 16px", fontWeight: "500", color: "#0f172a", fontSize: "14px" }}>{job.jobTitle || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>{job.location || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#0f172a", fontSize: "14px", fontWeight: "600", textAlign: "center" }}>
                            <span style={{ backgroundColor: "#e2e8f0", padding: "2px 8px", borderRadius: "10px", fontSize: "12px" }}>{job.noofposition || 'N/A'}</span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>{job.experience || 'N/A'}</td>
                          <td style={{ padding: "12px 16px", color: "#334155", fontSize: "14px" }}>
                            {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <select 
                              onChange={(e) => handleAssignJob(job._id, e.target.value)}
                              value={job.hrId || ''} 
                              style={{ width: "100%", minWidth: "120px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#fff", color: "#0f172a", fontSize: "13px", cursor: "pointer", transition: "border-color 0.2s" }}
                              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                            >
                              <option value="">Select HR</option>
                              {hr.length > 0 ? (
                                hr.map((hrItem, idx) => (
                                  <option key={idx} value={hrItem.HrId}>{hrItem.name}</option>
                                ))
                              ) : (
                                <option value="">No HR available</option>
                              )}
                            </select>
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

export default CompanyJobs;