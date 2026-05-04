import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";
import styles from "./dashboard.module.css";

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchCompanyProfile = async () => {
    try {
      const response = await axios.get(`${API}/company/${companyId}`);
      setCompany(response.data);
    } catch (error) {
      alert(
        "Failed to fetch company profile. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) {
      navigate("/login");
      return;
    }
    fetchCompanyProfile();
  }, [companyId, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 50 * 1024) {
      alert("File is too large. Please select an image smaller than 50KB.");
      setFile(null);
      fileInputRef.current.value = "";
      return;
    }
    setFile(selectedFile || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    if (isUploading) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(`${API}/upload-logo/${companyId}`, {
          image: reader.result,
        });
        if (response.status === 200) {
          alert("Logo uploaded successfully!");
          setFile(null);
          fileInputRef.current.value = "";
          setCompany({
            ...company,
            companyLogoUrl: response.data.companyLogoUrl,
          });
        } else {
          alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        alert("Error uploading logo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ✅ Skeleton Loader JSX
  const SkeletonLoader = () => (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonLogo}></div>
      <div className={styles.skeletonLineTitle}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLineShort}></div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Main Section */}
      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {company?.companyName || "Loading..."}
          </h1>
          <p className={styles.welcomeSubtitle}>
            Here's what's happening with your company today
          </p>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Jobs</span>
              {/* <span className={`${styles.statTrend} ${styles.up}`}>↑ 12%</span> */}
            </div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statChart}>
              <div className={styles.chartLine}></div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Selected</span>
              {/* <span className={`${styles.statTrend} ${styles.up}`}>↑ 8%</span> */}
            </div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statChart}>
              <div className={styles.chartLine}></div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Rejected</span>
              {/* <span className={`${styles.statTrend} ${styles.up}`}>↑ 5%</span> */}
            </div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statChart}>
              <div className={styles.chartLine}></div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Total Hired</span>
              {/* <span className={`${styles.statTrend} ${styles.down}`}>↓ 2%</span> */}
            </div>
            <div className={styles.statValue}>0</div>
            <div className={styles.statChart}>
              <div className={styles.chartLine}></div>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className={styles.grid}>
          {/* Profile Card */}
          <div className={`${styles.card} ${styles.profileCard}`}>
            <div className={styles.cardHeader}>
              <div
                className={styles.cardIcon}
                style={{ background: "rgba(59, 130, 246, 0.1)" }}
              >
                👤
              </div>
              <h2 className={styles.cardTitle}>Profile</h2>
            </div>

            {loading ? (
              <SkeletonLoader />
            ) : (
              <>
                <div className={styles.companyLogoSection}>
                  <form
                    onSubmit={handleUpload}
                    className={styles.logoUploadForm}
                  >
                    <div className={`${styles.logoUploadContainer} group`}>
                      <img
                        src={company.companyLogoUrl || "/default-logo.png"}
                        alt="Company Logo"
                        className={styles.logoImg}
                      />
                      <label className={styles.overlayLabel}>
                        <i className={`fa fa-edit  ${styles.iconStyle}`}></i>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      className={styles.uploadBtn}
                      disabled={!file || isUploading}
                    >
                      {isUploading ? "Uploading..." : "Update"}
                    </button>
                  </form>
                </div>

                <div className={styles.profileDetails}>
                  <div className={styles.profileDetail}>
                    <span className={styles.profileLabel}>Company Name:</span>
                    <span className={styles.profileValue}>
                      {company.companyName}
                    </span>
                  </div>
                  <div className={styles.profileDetail}>
                    <span className={styles.profileLabel}>Type:</span>
                    <span className={styles.profileValue}>
                      {company.companyType}
                      {company.otherCompanyType &&
                        ` (${company.otherCompanyType})`}
                    </span>
                  </div>
                  <div className={styles.profileDetail}>
                    <span className={styles.profileLabel}>Position:</span>
                    <span className={styles.profileValue}>
                      {company.position}
                    </span>
                  </div>
                  <div className={styles.profileDetail}>
                    <span className={styles.profileLabel}>Business Model:</span>
                    <span className={styles.profileValue}>
                      {company.businessmodel}
                    </span>
                  </div>
                  <div className={styles.profileDetail}>
                    <span className={styles.profileLabel}>Email:</span>
                    <span className={styles.profileValue}>{company.email}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Instructions Card */}
          <div className={`${styles.card} ${styles.instructionsCard}`}>
            <div className={styles.cardHeader}>
              <div
                className={styles.cardIcon}
                style={{ background: "rgba(139, 92, 246, 0.1)" }}
              >
                📖
              </div>
              <h2 className={styles.cardTitle}>How to Use Dashboard</h2>
            </div>
            <div className={styles.cardContent}>
              <ul className={styles.instructionsList}>
                <li className={styles.instructionItem}>
                  <span className={styles.instructionNumber}>1</span>
                  <span className={styles.instructionText}>
                    Your company profile details are displayed here.
                  </span>
                </li>
                <li className={styles.instructionItem}>
                  <span className={styles.instructionNumber}>2</span>
                  <span className={styles.instructionText}>
                    Click the edit icon on the logo to upload (max 50KB).
                  </span>
                </li>
                <li className={styles.instructionItem}>
                  <span className={styles.instructionNumber}>3</span>
                  <span className={styles.instructionText}>
                   Ensure your company logo is uploaded, otherwise you cannot post.
                  </span>
                </li>
                <li className={styles.instructionItem}>
                  <span className={styles.instructionNumber}>4</span>
                  <span className={styles.instructionText}>
                   Always confirm before selecting, rejecting, or uploading offer letters.
                  </span>
                </li>
                <li className={styles.instructionItem}>
                  <span className={styles.instructionNumber}>5</span>
                  <span className={styles.instructionText}>
                    Use the sidebar for jobs post, selected candidates, interview process and hired candidates.
                  </span>
                </li>
                <li className={styles.instructionItem}>
                  <span className={styles.instructionNumber}>6</span>
                  <span className={styles.instructionText}>
                   Contact support if you face any issues <a href="mailto:support@doltec.in"><i class="fa fa-envelope" aria-hidden="true"></i></a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Analytics Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div
                className={styles.cardIcon}
                style={{ background: "rgba(34, 197, 94, 0.1)" }}
              >
                📊
              </div>
              <h2 className={styles.cardTitle}>Analytics Overview</h2>
            </div>
            <div className={styles.cardContent}>
              <p style={{ marginBottom: "1rem" }}>
                Track your company's performance with real-time analytics and
                insights.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Total Hired</span>
                  <span style={{ color: "#22c55e" }}>0%</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Total Selected</span>
                  <span style={{ color: "#3b82f6" }}>0%</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Total Rejected</span>
                  <span style={{ color: "#ef4444" }}>0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActionsGrid}>
          <button className={styles.actionBtn}>
            <div
              className={styles.actionIcon}
              style={{ background: "rgba(59, 130, 246, 0.1)" }}
            >
              ➕
            </div>
            <span className={styles.actionLabel}>New Project</span>
          </button>

          <button className={styles.actionBtn}>
            <div
              className={styles.actionIcon}
              style={{ background: "rgba(139, 92, 246, 0.1)" }}
            >
              👥
            </div>
            <span className={styles.actionLabel}>Invite Team</span>
          </button>

          <button className={styles.actionBtn}>
            <div
              className={styles.actionIcon}
              style={{ background: "rgba(34, 197, 94, 0.1)" }}
            >
              📄
            </div>
            <span className={styles.actionLabel}>Generate Report</span>
          </button>

          <button className={styles.actionBtn}>
            <div
              className={styles.actionIcon}
              style={{ background: "rgba(234, 179, 8, 0.1)" }}
            >
              ⚙️
            </div>
            <span className={styles.actionLabel}>Settings</span>
          </button>
        </div>

        {/* Activity Section */}
        {/* <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h2 className={styles.activityTitle}>Recent Activity</h2>
            <button className={styles.viewAllBtn}>View All</button>
          </div>

          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div
                className={styles.activityIcon}
                style={{ background: "rgba(59, 130, 246, 0.1)" }}
              >
                📝
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  <strong>Sarah Johnson</strong> created a new project "Website
                  Redesign"
                </p>
                <p className={styles.activityTime}>2 hours ago</p>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div
                className={styles.activityIcon}
                style={{ background: "rgba(139, 92, 246, 0.1)" }}
              >
                ✅
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  <strong>Mike Chen</strong> completed task "Update
                  documentation"
                </p>
                <p className={styles.activityTime}>5 hours ago</p>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div
                className={styles.activityIcon}
                style={{ background: "rgba(34, 197, 94, 0.1)" }}
              >
                👥
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  <strong>Emily Davis</strong> joined the team
                </p>
                <p className={styles.activityTime}>1 day ago</p>
              </div>
            </div>

            <div className={styles.activityItem}>
              <div
                className={styles.activityIcon}
                style={{ background: "rgba(234, 179, 8, 0.1)" }}
              >
                💬
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>
                  <strong>Alex Turner</strong> commented on "Q4 Planning"
                </p>
                <p className={styles.activityTime}>2 days ago</p>
              </div>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}
