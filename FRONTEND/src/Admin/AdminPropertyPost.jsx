import React, { useState, useRef } from "react";
import axios from "axios";
import API from "../API";

const formFields = [
  { name: "title", label: "Property Title", type: "text" },
  { name: "description", label: "Description", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "locality", label: "Locality", type: "text" },
  { name: "price", label: "Price (INR)", type: "number" },
  { name: "category", label: "Category", type: "select", options: ['RESIDENTIAL', 'COMMERCIAL', 'PLOTS_LAND', 'PROJECTS', 'NEW_LAUNCH'] },
  { name: "propertyType", label: "Property Type (e.g., Apartment, Villa)", type: "text" },
  { name: "bhk", label: "BHK (e.g., 2, 3, 4)", type: "text", isFeature: true },
  { name: "areaSqFt", label: "Area (Sq Ft)", type: "number", isFeature: true },
  { name: "tier", label: "Promotion Plan", type: "select", options: ['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'] },
];

const AdminPropertyPost = () => {
  const initialDetails = {
    title: "",
    description: "",
    city: "",
    locality: "",
    price: "",
    category: "RESIDENTIAL",
    propertyType: "",
    bhk: "",
    areaSqFt: "",
    tier: "PLAIN",
  };

  const [details, setDetails] = useState(initialDetails);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const showError = (msg) => alert(msg);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ["title", "city", "locality", "price", "propertyType"];
    for (let field of requiredFields) {
      if (!details[field]) {
        return showError(`Please fill in ${field}`);
      }
    }

    const propertyData = {
      title: details.title,
      description: details.description,
      city: details.city,
      locality: details.locality,
      price: Number(details.price),
      category: details.category,
      propertyType: details.propertyType,
      tier: details.tier,
      features: {
        bhk: details.bhk,
        areaSqFt: Number(details.areaSqFt) || 0,
      }
    };
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(propertyData));
      
      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(`${API}/admin-post-property`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Property posted successfully directly to active listings!");
      setDetails(initialDetails);
      setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      window.location.href = "/AdminRealEstate"; // redirect back to active properties dashboard if needed
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Error processing property.";
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
            Post a Property (Admin)
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Directly publish a property to the active real estate listings.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {formFields.map(({ name, label, type, options }) => {
              const isFullWidth = ["description"].includes(name);
              const isTextArea = name === "description";
              const isSelect = type === "select";

              return (
                <div key={name} style={{ flex: isFullWidth ? "1 1 100%" : "1 1 calc(50% - 12px)" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>{label}</label>
                  {isTextArea ? (
                    <textarea
                      name={name}
                      value={details[name]}
                      onChange={handleChange}
                      required={["title", "city", "locality", "price", "propertyType"].includes(name)}
                      disabled={loading}
                      style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", minHeight: "120px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                  ) : isSelect ? (
                    <select
                      name={name}
                      value={details[name]}
                      onChange={handleChange}
                      disabled={loading}
                      style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    >
                      {options.map((opt) => (
                        <option key={opt} value={opt} style={{ color: "#0f172a" }}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={name}
                      type={type}
                      value={details[name]}
                      onChange={handleChange}
                      required={["title", "city", "locality", "price", "propertyType"].includes(name)}
                      disabled={loading}
                      style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#0f172a", backgroundColor: "#fff", fontSize: "15px", transition: "border-color 0.2s", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                  )}
                </div>
              );
            })}
            
            <div style={{ flex: "1 1 100%" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>Property Images (Up to 10)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                ref={fileInputRef}
                style={{ width: "100%", padding: "16px", border: "1px dashed #cbd5e1", borderRadius: "8px", color: "#475569", backgroundColor: "#f8fafc", boxSizing: "border-box", cursor: "pointer", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
              />
              {images.length > 0 && <p style={{ fontSize: "13px", color: "#16a34a", marginTop: "8px", fontWeight: "500" }}>✅ {images.length} image(s) selected.</p>}
            </div>

          </div>
          
          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "16px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => window.location.href = "/AdminRealEstate"}
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
              {loading ? "Posting..." : "Publish Property Directly"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPropertyPost;
