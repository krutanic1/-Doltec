import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../API";

export default function AllJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true); // <-- added state

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/company-all-jobs`);
      console.log("jobs", response.data);
      setJobsData(response.data);
    } catch (error) {
      console.error("Fetch jobs error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Extract all unique skills for filters
  const allTags = Array.from(
    new Set(
      jobsData.flatMap((job) =>
        job.desiredSkills.split(",").map((s) => s.trim())
      )
    )
  );

  const alllocation = Array.from(
    new Set(
      jobsData.flatMap((job) => job.city.split(",").map((s) => s.trim()))
    )
  );

  // Filter jobs based on search and filters
  const filteredJobs = jobsData.filter((job) => {
    const skillsArray = job.desiredSkills.split(",").map((s) => s.trim());

    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType =
      selectedJobType === "all" || job.jobType === selectedJobType;

    const matchesLocation =
      selectedLocation === "all" || job.city.includes(selectedLocation);

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => skillsArray.includes(tag));

    return matchesSearch && matchesJobType && matchesLocation && matchesTags;
  });

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedJobType("all");
    setSelectedLocation("all");
    setSelectedTags([]);
    setSearchTerm("");
  };

  // Skeleton job card component
  const SkeletonJobCard = () => (
    <div className="job-card skeleton-card">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
    </div>
  );

  return (
    <div id="all-jobs-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs, companies, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>Search Jobs</button>
        </div>
      </section>

      {/* Filter toggle for mobile */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="jobs-layout">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? "show" : ""}`}>
          <h3>Filters</h3>

          {/* Job Type Filter */}
          <div className="filter-group">
            <label>Job Type:</label>
            <select
              style={{ backgroundColor: "black" }}
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="In Office">In Office</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label>Location:</label>
            <select
              style={{ backgroundColor: "black" }}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {alllocation.map((loc, index) => (
                <option key={`loc-${index}`} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Filter */}
          <div className="filter-group">
            <label>Skills:</label>
            {allTags.map((tag, index) => (
              <div key={`tag-${index}`} className="skill-item">
                <input
                  type="checkbox"
                  id={`tag-${index}`}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                <label htmlFor={`tag-${index}`}>{tag}</label>
              </div>
            ))}
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        </aside>

        {/* Job Listings */}
        <main className="jobs-section">
          <div className="jobs-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonJobCard key={i} />
                ))
              : filteredJobs.map((job) => (
                  <div key={job._id} className="job-card">
                    <div className="job-header">
                      <div className="company-and-title">
                        <h3>{job.jobTitle}</h3>
                        <p className="company">
                          {job.companyName} | {job.jobType}
                        </p>
                      </div>
                      <div className="company-logo">
                        <img
                          src={job.companyLogoUrl || "/default-logo.png"}
                          alt="logo"
                        />
                      </div>
                    </div>
                    <p>
                      <strong>Location:</strong> {job.city}
                    </p>
                    <p>
                      <strong>Salary:</strong> {job.salary.minSalary} -{" "}
                      {job.salary.maxSalary} {job.salary.currency} /{" "}
                      {job.salary.per}
                    </p>
                    <p>
                      <strong>Posted:</strong>{" "}
                      {new Date(job.jobPostedOn).toLocaleDateString()}
                    </p>
                    <div className="tags">
                      {job.desiredSkills.split(",").map((tag, index) => (
                        <span key={`${job._id}-${index}`} className="tag">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <button className="apply-button">
                      <Link to="/StudentLogIn">Apply Now</Link>
                    </button>
                  </div>
                ))}
          </div>
          {!loading && filteredJobs.length === 0 && (
            <p>No jobs found matching your criteria.</p>
          )}
        </main>
      </div>
    </div>
  );
}
