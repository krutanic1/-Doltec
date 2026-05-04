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
    <div id="admin-company-joblist">
       <div className="company__job__container">
       <h2 className="job-list-title">Job List</h2>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Company Name</th>
            <th className="header-cell">Location</th>
            <th className="header-cell">No of Jobs</th>
            <th className="header-cell">Total Positions</th>
            <th className="header-cell">Experience Range</th>
            {/* <th className="header-cell">Job Post Limit</th> */}
            {/* <th className="header-cell">Add Job Limit</th> */}
          </tr>
        </thead>
        <tbody className="table-body">
          {companyList.length > 0 ? (
            companyList.map((company, index) => (
              <tr key={index} className="job-row">
                <td className="job-cell">{company.companyName}</td>
                <td className="job-cell">{company.location}</td>
                <td 
                  className="job-cell job-count-cell" 
                  onClick={() => handleJobCountClick(company.companyName)}
                >
                  {company.jobCount}
                </td>
                <td className="job-cell">{company.totalPositions}</td>
                <td className="job-cell">{company.experienceRange}</td>
                {/* <td className="job-cell">{company.jobPostLimit}</td>
                <td className="job-cell">
                  <button
                    onClick={() => handleAddJobLimit(company.companyId)}
                    className="add-limit-button"
                  >
                    Add Limit
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="7">
                No jobs available
              </td> 
            </tr>
          )}
        </tbody>
      </table>
      {isDialogOpen && selectedCompany && groupedJobs[selectedCompany] && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h3 className="dialog-title">Jobs at {selectedCompany}</h3>
              <span onClick={() => {setIsDialogOpen(false);setSelectedCompany(null);}} className="dialog-close">
                x
              </span>
            </div>
            <div className="dialog-content">
              <table className="dialog-table">
                <thead className="dialog-table-header">
                  <tr className="dialog-header-row">
                    <th className="dialog-header-cell">Job Title</th>
                    <th className="dialog-header-cell">Location</th>
                    <th className="dialog-header-cell">Positions</th>
                    <th className="dialog-header-cell">Experience</th>
                    <th className="dialog-header-cell">Application Deadline</th>
                    <th className="dialog-header-cell">Assign Job to HR</th>
                  </tr>
                </thead>
                <tbody className="dialog-table-body">
                  {groupedJobs[selectedCompany].map((job, index) => (
                    <tr key={index} className="dialog-job-row">
                      <td className="dialog-job-cell">{job.jobTitle || 'N/A'}</td>
                      <td className="dialog-job-cell">{job.location || 'N/A'}</td>
                      <td className="dialog-job-cell">{job.noofposition || 'N/A'}</td>
                      <td className="dialog-job-cell">{job.experience || 'N/A'}</td>
                      <td className="dialog-job-cell">
                        {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="dialog-job-cell">
                        <select 
                          className="hr-dropdown" 
                          onChange={(e) => handleAssignJob(job._id, e.target.value)}
                          value={job.hrId || ''} 
                        >
                          <option value="">Select HR</option>
                          {hr.length > 0 ? (
                            hr.map((hr, idx) => (
                              <option key={idx} value={hr.HrId}>{hr.name}</option>
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
      )}
       </div>
    </div>
  );
};

export default CompanyJobs;