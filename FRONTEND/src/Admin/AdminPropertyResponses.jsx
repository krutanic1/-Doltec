import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const AdminPropertyResponses = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin-property-responses`);
      setResponses(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch property responses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Property Leads
          </h2>
          <span style={{ backgroundColor: "#e2e8f0", color: "#334155", padding: "6px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "600" }}>
            {responses.length} Inquiries
          </span>
        </div>

        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading leads...</div>
          ) : error ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>{error}</div>
          ) : responses.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
              <p>No leads found for admin-posted properties.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>S.No</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Lead Details</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Info</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Property Inquiry</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Message / Notes</th>
                    <th style={{ padding: "16px 20px", color: "#475569", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((lead, index) => (
                    <tr key={lead._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "14px" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "20px" }}>
                        <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "15px" }}>
                          {lead.name || lead.viewerName || "Unknown User"}
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                          <span style={{ display: "inline-block", padding: "2px 8px", backgroundColor: lead.status === 'new' ? '#dcfce7' : '#f1f5f9', color: lead.status === 'new' ? '#16a34a' : '#475569', borderRadius: "12px", fontSize: "11px", fontWeight: "600", textTransform: "capitalize" }}>
                            {lead.status || 'New'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "20px", fontSize: "14px" }}>
                        <div style={{ marginBottom: "6px" }}>
                          {lead.email || lead.viewerEmail ? (
                            <a href={`mailto:${lead.email || lead.viewerEmail}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                              ✉️ {lead.email || lead.viewerEmail}
                            </a>
                          ) : <span style={{ color: "#94a3b8" }}>No Email</span>}
                        </div>
                        <div>
                          {lead.phone || lead.viewerPhone ? (
                            <a href={`tel:${lead.phone || lead.viewerPhone}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                              📞 {lead.phone || lead.viewerPhone}
                            </a>
                          ) : <span style={{ color: "#94a3b8" }}>No Phone</span>}
                        </div>
                      </td>
                      <td style={{ padding: "20px", fontSize: "14px" }}>
                        {lead.propertyId ? (
                          <div>
                            <div style={{ fontWeight: "600", color: "#334155", marginBottom: "4px" }}>{lead.propertyId.title}</div>
                            <div style={{ color: "#64748b", fontSize: "13px" }}>📍 {lead.propertyId.city} &bull; {lead.propertyId.category}</div>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>Property Unavailable</span>
                        )}
                      </td>
                      <td style={{ padding: "20px", maxWidth: "250px" }}>
                        {lead.message ? (
                          <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.5" }}>{lead.message}</div>
                        ) : lead.notes ? (
                          <div style={{ fontSize: "13px", fontStyle: "italic", color: "#64748b", lineHeight: "1.5" }}>{lead.notes}</div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "14px", fontStyle: "italic" }}>Contact Unlocked</span>
                        )}
                      </td>
                      <td style={{ padding: "20px", color: "#64748b", fontSize: "14px", whiteSpace: "nowrap" }}>
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>
                          {new Date(lead.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
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

export default AdminPropertyResponses;
