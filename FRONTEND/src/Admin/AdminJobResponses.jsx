import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API from '../API';

const AdminJobResponses = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin-job-responses`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching admin job responses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Job Applicants
          </h2>
          <span style={{ backgroundColor: "#e2e8f0", color: "#334155", padding: "6px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }}>
            {applications.length} Applications
          </span>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading responses...</div>
          ) : applications.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
              <p>No responses found for Admin jobs.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>S.No</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Candidate Details</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Info</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Job Role</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={app._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "14px" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "20px" }}>
                        <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>
                          {app.userId?.fullname || "Unknown User"}
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                          <span style={{ display: "inline-block", padding: "2px 8px", backgroundColor: app.status === 'pending' ? '#fef3c7' : '#dcfce7', color: app.status === 'pending' ? '#d97706' : '#16a34a', borderRadius: "12px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>
                            {app.status || 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "20px", fontSize: "14px" }}>
                        <div style={{ marginBottom: "6px" }}>
                          {app.userId?.email ? (
                            <a href={`mailto:${app.userId.email}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                              ✉️ {app.userId.email}
                            </a>
                          ) : <span style={{ color: "#94a3b8" }}>No Email</span>}
                        </div>
                        <div>
                          {app.userId?.phone ? (
                            <a href={`tel:${app.userId.phone}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                              📞 {app.userId.phone}
                            </a>
                          ) : <span style={{ color: "#94a3b8" }}>No Phone</span>}
                        </div>
                      </td>
                      <td style={{ padding: "20px", fontSize: "14px" }}>
                        <div style={{ fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                          {app.jobId?.jobTitle || "Unknown Role"}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "13px" }}>
                          🏢 {app.jobId?.companyName || "Doltec Admin"}
                        </div>
                      </td>
                      <td style={{ padding: "20px", fontSize: "14px" }}>
                        {app.resumeId?.resumeUrl ? (
                          <a href={app.resumeId.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", backgroundColor: "#f1f5f9", color: "#0f172a", padding: "6px 12px", borderRadius: "6px", textDecoration: "none", fontWeight: "500", fontSize: "13px", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e2e8f0"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}>
                            📄 View Resume
                          </a>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No Resume</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobResponses;
