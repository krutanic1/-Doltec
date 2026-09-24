import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const Createhr = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });
  const [hrs, setHrs] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.post(`${API}/createhr`, formData);
  //     alert("HR created successfully");
  //     setFormData({
  //       name: "",
  //       email: "",
  //       number: "",
  //       password: "",
  //     });
  //     fetchHrs();
  //   } catch (error) {
  //     alert("HR Already Created With Given Details..");
  //     console.log(`Error: ${error.message}`);
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isEditMode && editId) {
        await axios.put(`${API}/edithr/${editId}`, formData);
        alert("HR updated successfully");
      } else {
        await axios.post(`${API}/createhr`, formData);
        alert("HR created successfully");
      }

      setFormData({ name: "", email: "", number: "", password: "" });
      setIsEditMode(false);
      setEditId(null);
      fetchHrs();
    } catch (error) {
      alert("Operation failed. HR may already exist.");
      console.log(`Error: ${error.message}`);
    }
  };

  const fetchHrs = async () => {
    try {
      const response = await axios.get(`${API}/gethr`);
      setHrs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (hr) => () => {
    setFormData({
      name: hr.name,
      email: hr.email,
      number: hr.number,
      password: hr.password,
    });
    setIsEditMode(true);
    setEditId(hr._id);
  };
const handleDelete = (id) => async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this HR?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`${API}/deletehr/${id}`);
    alert("HR deleted successfully");
    fetchHrs();
  } catch (error) {
    alert("Failed to delete HR");
    console.log(`Error: ${error.message}`);
  }
};

  useEffect(() => {
    fetchHrs();
  }, []);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Form Section */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              {isEditMode ? "Update HR Account" : "Create New HR Account"}
            </h2>
            <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Manage Human Resources access and details.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  placeholder="Enter HR name"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Email ID</label>
                <input
                  type="email"
                  value={formData.email}
                  placeholder="hr@example.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Phone Number</label>
                <input
                  type="number"
                  value={formData.number}
                  placeholder="10-digit number"
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  required
                  style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>
              <div style={{ position: "relative" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  placeholder="Secure password"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditMode}
                  style={{ width: "100%", padding: "12px 40px 12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                />
                <span
                  onClick={handleTogglePasswordVisibility}
                  style={{ position: "absolute", right: "12px", top: "38px", cursor: "pointer", color: "#64748b" }}
                >
                  <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{ padding: "12px 32px", background: "#0B1F3A", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1a365d"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0B1F3A"}
              >
                {isEditMode ? "Update HR" : "Create HR"}
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>HR List</h2>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sl No</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Number</th>
                  <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {hrs.length > 0 ? (
                  hrs.map((hr, index) => (
                    <tr key={hr._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "14px" }}>{index + 1}</td>
                      <td style={{ padding: "20px", fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>{hr.name}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{hr.email}</td>
                      <td style={{ padding: "20px", color: "#334155", fontSize: "14px" }}>{hr.number}</td>
                      <td style={{ padding: "20px" }}>
                        <button
                          onClick={handleEdit(hr)}
                          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "18px", marginRight: "15px", padding: 0 }}
                          title="Edit"
                        >
                          <i className="fa fa-pencil-square-o"></i>
                        </button>
                        <button
                          onClick={handleDelete(hr._id)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", padding: 0 }}
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <div style={{ fontSize: "40px", marginBottom: "10px" }}>👥</div>
                      <p>No HRs found.</p>
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

export default Createhr;
