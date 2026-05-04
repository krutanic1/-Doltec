import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";
import { useLocation } from "react-router-dom";

const formFields = [
  { name: "jobTitle", label: "Job Title", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "jobType", label: "Job Type (e.g., In Office)", type: "text" },
  { name: "jobTiming", label: "Job Timing (e.g., Full Time)", type: "text" },
  { name: "workingDays", label: "Working Days (e.g., 5 Days)", type: "text" },
  { name: "minSalary", label: "Minimum (CTC)", type: "number", salary: true },
  { name: "maxSalary", label: "Maximum (CTC)", type: "number", salary: true },
  { name: "jobDescription", label: "Job Description", type: "text" },
  { name: "desiredSkills", label: "Desired Skills", type: "text" },
  { name: "experience", label: "Experience (e.g., 1 Year)", type: "text" },
  { name: "noofposition", label: "No of Position", type: "number" },
  { name: "applicationDeadline", label: "Application Deadline", type: "date", InputLabelProps: { shrink: true } },
];

const CompanyJobPost = () => {
  const initialJobDetails = {
    jobTitle: "",
    location: "",
    city: "",
    jobType: "",
    jobTiming: "",
    workingDays: "",
    salary: { minSalary: "", maxSalary: "", currency: "INR", per: "Year" },
    jobDescription: "",
    desiredSkills: "",
    experience: "",
    noofposition: "",
    applicationDeadline: "",
  };

  const [jobDetails, setJobDetails] = useState(initialJobDetails);
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobPostLimit, setJobPostLimit] = useState(2);
  const companyId = localStorage.getItem("companyId");
  const location = useLocation();

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/company-jobs`, {
        params: { companyId },
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error("Fetch jobs error:", error.message);
      alert(error.response?.data?.message || "Failed to load jobs.");
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(`${API}/company/${companyId}`);
      const limit = response.data.jobPostLimit === null ? Infinity : response.data.jobPostLimit;
      setJobPostLimit(limit);
      console.log("Fetched job post limit:", limit);
    } catch (error) {
      console.error("Fetch company details error:", error.message);
      alert(error.response?.data?.message || "Failed to load company details.");
    }
  };

  useEffect(() => {
    if (!companyId) {
      alert("Please log in to view jobs.");
      return;
    }
    fetchJobs();
    fetchCompanyDetails();
  }, [companyId]);

  useEffect(() => {
    if (location.state?.fromSubscription) {
      fetchCompanyDetails();
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      [name.includes("Salary") ? "salary" : name]: name.includes("Salary")
        ? { ...prev.salary, [name]: value }
        : name === "noofposition"
        ? value
          ? Number(value)
          : ""
        : value,
    }));
  };

  const showError = (message) => {
    alert(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) {
      return showError("Please log in to post a job.");
    }
    if (!editingId && jobs.length >= jobPostLimit && jobPostLimit !== Infinity) {
      showError("Job post limit reached. Please subscribe to post more jobs.");
      return;
    }
    const requiredFields = [
      "jobTitle",
      "city",
      "location",
      "jobType",
      "jobTiming",
      "workingDays",
      "jobDescription",
      "desiredSkills",
      "experience",
      "noofposition",
      "applicationDeadline",
    ];
    for (const field of requiredFields) {
      if (!jobDetails[field]) {
        return showError(`Please fill in ${field}`);
      }
    }
    if (!jobDetails.salary.minSalary || !jobDetails.salary.maxSalary) {
      return showError("Please provide both minimum and maximum salary");
    }
    const jobData = {
      ...jobDetails,
      companyId,
      noofposition: Number(jobDetails.noofposition) || 0,
      salary: {
        ...jobDetails.salary,
        minSalary: Number(jobDetails.salary.minSalary) || 0,
        maxSalary: Number(jobDetails.salary.maxSalary) || 0,
      },
    };
    setLoading(true);
    try {
      const response = editingId
        ? await axios.put(`${API}/company-jobs/${editingId}`, jobData)
        : await axios.post(`${API}/company-jobs`, jobData);
      setJobs((prev) =>
        editingId
          ? prev.map((job) => (job._id === editingId ? response.data : job))
          : [...prev, response.data]
      );
      alert(
        editingId ? "Job updated successfully!" : "Job posted successfully!"
      );
      resetForm();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Error processing job.";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setJobDetails({
      ...job,
      noofposition: job.noofposition.toString(),
      salary: {
        ...job.salary,
        minSalary: job.salary.minSalary.toString(),
        maxSalary: job.salary.maxSalary.toString(),
      },
    });
    setEditingId(job._id);
    setOpen(true);
  };

  const resetForm = () => {
    setOpen(false);
    setEditingId(null);
    setJobDetails(initialJobDetails);
  };

  const handleView = (job) => {
    setSelectedJobDetails(true);
    setSelectedJob(job);
  };

  const handleSubscribe = () => {
    window.location.href = "/SubscriptionDialog";
  };

  return (
    <div id="companyjobpost">
      <div className="heading">
        <h2 className="job-list-title">Job List</h2>
        {jobPostLimit === Infinity || jobs.length < jobPostLimit ? (
          <button className="add-button" onClick={() => setOpen(true)}>
            Add/Post Job
          </button>
        ) : (
          <button className="subscribe-button" onClick={handleSubscribe}>
            Subscribe
          </button>
        )}
      </div>
      <div className="subscriptionbtn"></div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            {[
              "S.No",
              "Job Title",
              "Location",
              "Desired Skills",
              "No of Position",
              "Application Deadline",
              "info",
              "Actions",
            ].map((header) => (
              <th key={header} className="header-cell">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {jobs.length === 0 ? (
            <tr className="no-jobs-row">
              <td colSpan="8" className="no-jobs-cell">
                No jobs added
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job._id} className="job-row">
                <td className="job-cell">{jobs.indexOf(job) + 1}</td>
                <td className="job-cell">{job.jobTitle}</td>
                <td className="job-cell">{job.location}</td>
                <td className="job-cell">{job.desiredSkills}</td>
                <td className="job-cell">{job.noofposition}</td>
                <td className="job-cell">{job.applicationDeadline}</td>
                <td className="job-cell">
                  <button
                    className="edit-button"
                    onClick={() => handleView(job)}
                  >
                    <i className="fa fa-info-circle"></i>
                  </button>
                </td>
                <td className="job-cell">
                  <button
                    className="edit-button"
                    onClick={() => handleEditJob(job)}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingId ? "Edit Job" : "Post a New Job"}
            </h2>
            <form onSubmit={handleSubmit}>
              {formFields.map(({ name, label, type, salary }) => {
                const isFullWidth = [
                  "jobDescription",
                  "desiredSkills",
                  "applicationDeadline",
                ].includes(name);
                const isTextArea = name === "jobDescription";
                return (
                  <div
                    className={`form-group ${isFullWidth ? "full" : ""}`}
                    key={name}
                  >
                    <label htmlFor={name}>{label}</label>
                    {isTextArea ? (
                      <textarea
                        id={name}
                        name={name}
                        value={jobDetails[name]}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    ) : (
                      <input
                        id={name}
                        name={name}
                        type={type}
                        value={
                          salary ? jobDetails.salary[name] : jobDetails[name]
                        }
                        onChange={handleChange}
                        disabled={loading}
                      />
                    )}
                  </div>
                );
              })}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={loading}
                >
                  {loading
                    ? "Loading..."
                    : editingId
                    ? "Update Job"
                    : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedJobDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Job Details</h2>
            <div className="job-details">
              <p><strong>JobType: </strong>{selectedJob.jobType}</p>
              <p><strong>City: </strong>{selectedJob.city}</p>
              <p><strong>Experience:</strong> {selectedJob.experience}</p>
              <p>
                <strong>Salary:</strong> {selectedJob.salary.minSalary} -{" "}
                {selectedJob.salary.maxSalary} {selectedJob.salary.currency}
              </p>
              <p><strong>Job Timing: </strong>{selectedJob.jobTiming}</p>
              <p><strong>Working Days:</strong> {selectedJob.workingDays}</p>
              <strong>Description:</strong>
              <pre>{selectedJob.jobDescription}</pre>
            </div>
            <button
              type="button"
              onClick={() => setSelectedJobDetails(false)}
              className="btn-cancel"
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobPost;