import React, { useEffect, useState } from 'react';
import API from '../API';
import axios from 'axios';

const CompanyOnboardList = () => {
  const [responses, setResponses] = useState([]);
   const [showEditForm, setShowEditForm] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);

  const fetchContactUs = async () => {
    try {
      const res = await axios.get(`${API}/allcompany`);
      setResponses(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }
  };

    const handleAddJobLimit = async (companyId) => {
      const confirmAddLimit = window.confirm('Are you sure you want to add a job post limit for this company?');
    if (!confirmAddLimit) {
      return;
    }
    try {
      const response = await axios.post(`${API}/increment-job-limit`, { companyId });
      alert(response.data.message);
       fetchContactUs();
      // const updatedCompanies = await axios.get(`${API}/companies`);
      // setCompanies(updatedCompanies.data);
    } catch (error) {
      alert('Failed to update job limit: ' + error.response?.data?.message || error.message);
    }
  };

  const handleEditClick = (company) => {
    setCurrentCompany(company);
    setShowEditForm(true);
  };

  // 🔹 Update form fields dynamically
  const handleFormChange = (e) => {
    setCurrentCompany({ ...currentCompany, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form to backend
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/company/${currentCompany._id}`, currentCompany);
      alert('Company updated successfully');
      setShowEditForm(false);
      fetchContactUs();
    } catch (err) {
      alert('Error updating company: ' + (err.response?.data?.message || err.message));
    }
  };


  useEffect(() => {
    fetchContactUs();
  }, []);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Company Onboard List
            </h2>
            <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Manage onboarded companies and their job posting limits.</p>
          </div>
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
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Position</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Business Model</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Limit</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Action</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>D & T</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center" }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {responses.length > 0 ? (
                  responses.map((item, index) => (
                    <tr key={item._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "14px" }}>{index + 1}</td>
                      <td style={{ padding: "20px", fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{item.companyName}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{item.email}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{item.phone}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{item.companyType ? item.companyType : item.otherCompanyType}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{item.position}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px", textTransform: "capitalize" }}>{item.businessmodel}</td>
                      <td style={{ padding: "20px", color: "#0f172a", fontSize: "15px", fontWeight: "600", textAlign: "center" }}>
                        <span style={{ backgroundColor: "#e2e8f0", padding: "4px 10px", borderRadius: "12px" }}>{item.jobPostLimit}</span>
                      </td>
                      <td style={{ padding: "20px", textAlign: "center" }}>
                        <button 
                          title="Add Job Limits" 
                          onClick={() => handleAddJobLimit(item.companyId)} 
                          style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3b82f6"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f1f5f9"; e.currentTarget.style.color = "#3b82f6"; }}
                        >
                          <i className="fa fa-sliders"></i>
                        </button>
                      </td>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "13px", whiteSpace: "nowrap" }}>{new Date(item.timestamp).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</td>
                      <td style={{ padding: "20px", textAlign: "center" }}>
                        <button 
                          onClick={() => handleEditClick(item)} 
                          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "18px", padding: 0 }}
                          title="Edit"
                        >
                          <i className="fa fa-pencil-square-o"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏢</div>
                      <p>No companies found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Editing Company */}
        {showEditForm && currentCompany && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>Edit Company Details</h3>
                <button onClick={() => setShowEditForm(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>&times;</button>
              </div>
              
              <form onSubmit={handleUpdateCompany} style={{ padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Company Name</label>
                    <input name="companyName" value={currentCompany.companyName} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Email</label>
                    <input name="email" value={currentCompany.email} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Phone</label>
                    <input name="phone" value={currentCompany.phone} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Company Type</label>
                    <input name="companyType" value={currentCompany.companyType} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Other Company Type</label>
                    <input name="otherCompanyType" value={currentCompany.otherCompanyType} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Position</label>
                    <input name="position" value={currentCompany.position} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Business Model</label>
                    <input name="businessmodel" value={currentCompany.businessmodel} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#475569" }}>Job Post Limit</label>
                    <input name="jobPostLimit" value={currentCompany.jobPostLimit} onChange={handleFormChange} style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }} />
                  </div>
                </div>
                
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                  <button type="button" onClick={() => setShowEditForm(false)} style={{ padding: "10px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" style={{ padding: "10px 24px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyOnboardList;
