import React, { useState } from "react";
import axios from "axios";
import API from "../API";

const formFields = [
  { name: "companyName", label: "Company Name (Typed by Admin)", type: "text" },
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
  { name: "applicationDeadline", label: "Application Deadline", type: "date" },
];

const AdminJobPost = () => {
  const initialJobDetails = {
    companyName: "",
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
  const [loading, setLoading] = useState(false);

  const showError = (msg) => alert(msg);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["minSalary", "maxSalary"].includes(name)) {
      setJobDetails((prev) => ({
        ...prev,
        salary: { ...prev.salary, [name]: value },
      }));
    } else {
      setJobDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let field of formFields.map((f) => f.name)) {
      if (field === "minSalary" || field === "maxSalary") continue;
      if (!jobDetails[field]) {
        return showError(`Please fill in ${field}`);
      }
    }
    if (!jobDetails.salary.minSalary || !jobDetails.salary.maxSalary) {
      return showError("Please provide both minimum and maximum salary");
    }

    const jobData = {
      ...jobDetails,
      noofposition: Number(jobDetails.noofposition) || 0,
      salary: {
        ...jobDetails.salary,
        minSalary: Number(jobDetails.salary.minSalary) || 0,
        maxSalary: Number(jobDetails.salary.maxSalary) || 0,
      },
    };
    
    setLoading(true);
    try {
      await axios.post(`${API}/post-job`, jobData);
      alert("Job posted successfully directly to active listings!");
      setJobDetails(initialJobDetails);
      window.location.href = "/CompanyJobs"; // redirect back to active jobs list
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

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Post a Job (Admin)
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Directly publish a job to the active listings.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {formFields.map(({ name, label, type, salary }) => {
              const isFullWidth = ["jobDescription", "desiredSkills", "companyName"].includes(name);
              const isTextArea = name === "jobDescription";
              return (
                <div key={name} style={{ flex: isFullWidth ? "1 1 100%" : "1 1 calc(50% - 12px)" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>{label}</label>
                  {isTextArea ? (
                    <textarea
                      name={name}
                      value={jobDetails[name]}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", minHeight: "120px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                  ) : (
                    <input
                      name={name}
                      type={type}
                      value={salary ? jobDetails.salary[name] : jobDetails[name]}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "16px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => window.location.href = "/CompanyJobs"}
              disabled={loading}
              style={{ padding: "12px 24px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "background-color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "12px 32px", background: "#0B1F3A", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "background-color 0.2s", opacity: loading ? 0.7 : 1 }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#1a365d")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0B1F3A")}
            >
              {loading ? "Posting..." : "Publish Job Directly"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminJobPost;
