import React, { useEffect, useState } from 'react';
import API from '../API';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserManagement = () => {
  const [responses, setResponses] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API}/allusers`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`
        }
      });
      setResponses(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      alert('Failed to load users: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleAddJobLimit = async (userId) => {
    try {
      const response = await axios.post(`${API}/increment-user-job-limit`, { userId }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`
        }
      });
      alert(response.data.message);
      await fetchAllUsers();
    } catch (error) {
      alert('Failed to update job limit: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Users List
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Manage registered users and their job posting limits.</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>S.No</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Assigned Limit</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Action</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {responses.length > 0 ? (
                  responses.map((item, index) => (
                    <tr key={item._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "14px" }}>{index + 1}</td>
                      <td style={{ padding: "20px", fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{item.name || 'N/A'}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{item.email || 'N/A'}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{item.phone || 'N/A'}</td>
                      <td style={{ padding: "20px", color: "#0f172a", fontSize: "15px", fontWeight: "600", textAlign: "center" }}>
                        <span style={{ backgroundColor: "#e2e8f0", padding: "4px 10px", borderRadius: "12px" }}>{item.jobLimit || 0}</span>
                      </td>
                      <td style={{ padding: "20px", textAlign: "center" }}>
                        <button 
                          title="Add Limits" 
                          onClick={() => handleAddJobLimit(item._id)}
                          style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3b82f6"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#3b82f6"; }}
                        >
                          <i className="fa fa-sliders"></i>
                        </button>
                      </td>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "13px", whiteSpace: "nowrap" }}>{new Date(item.timestamp).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>👥</div>
                      <p>No users found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;