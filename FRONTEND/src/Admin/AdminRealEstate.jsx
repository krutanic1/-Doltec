import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import API from "../API";

const initialForm = {
  propertyName: "",
  location: "",
  locationLink: "",
};

const AdminRealEstate = () => {
  const [formData, setFormData] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(initialForm);
  const [editImages, setEditImages] = useState([]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/real-estate`);
      setProperties(response.data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (images.length === 0) {
      alert("Please add at least one property image");
      return;
    }

    setSubmitting(true);

    try {
      const adminToken = Cookies.get("adminToken");
      const payload = new FormData();
      payload.append("propertyName", formData.propertyName);
      payload.append("location", formData.location);
      payload.append("locationLink", formData.locationLink);
      payload.append("createdByAdminName", localStorage.getItem("name") || "Admin");
      payload.append("createdByAdminId", localStorage.getItem("AdminId") || "");

      images.forEach((file) => {
        payload.append("images", file);
      });

      await axios.post(`${API}/real-estate`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: adminToken ? `Bearer ${adminToken}` : "",
        },
      });

      alert("Property added successfully");
      setFormData(initialForm);
      setImages([]);
      fetchProperties();
    } catch (error) {
      console.error("Error creating property:", error);
      alert(error.response?.data?.message || "Failed to add property");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const adminToken = Cookies.get("adminToken");
        await axios.delete(`${API}/real-estate/${propertyId}`, {
          headers: {
            Authorization: adminToken ? `Bearer ${adminToken}` : "",
          },
        });
        alert("Property deleted successfully");
        fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert(error.response?.data?.message || "Failed to delete property");
      }
    }
  };

  const openEditModal = (property) => {
    setEditingId(property._id);
    setEditFormData({
      propertyName: property.propertyName,
      location: property.location,
      locationLink: property.locationLink,
    });
    setEditImages([]);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditFormData(initialForm);
    setEditImages([]);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const adminToken = Cookies.get("adminToken");
      const payload = new FormData();
      payload.append("propertyName", editFormData.propertyName);
      payload.append("location", editFormData.location);
      payload.append("locationLink", editFormData.locationLink);

      editImages.forEach((file) => {
        payload.append("images", file);
      });

      await axios.put(`${API}/real-estate/${editingId}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: adminToken ? `Bearer ${adminToken}` : "",
        },
      });

      alert("Property updated successfully");
      closeEditModal();
      fetchProperties();
    } catch (error) {
      console.error("Error updating property:", error);
      alert(error.response?.data?.message || "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="admin-real-estate">
      <div className="admin-real-estate-container">
        <h2>Add Real Estate Property</h2>

        <form className="admin-real-estate-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Property Name"
            value={formData.propertyName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, propertyName: e.target.value }))
            }
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            required
          />

          <input
            type="url"
            placeholder="Location Link"
            value={formData.locationLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, locationLink: e.target.value }))
            }
            required
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Property"}
          </button>
        </form>

        <h3>Recently Added Properties</h3>
        <div className="admin-real-estate-list">
          {properties.length === 0 ? (
            <p className="empty-text">No properties found.</p>
          ) : (
            properties.map((property) => (
              <div className="admin-property-card" key={property._id}>
                <div className="admin-property-thumb">
                  {property.imageUrls?.[0] ? (
                    <img src={property.imageUrls[0]} alt={property.propertyName} />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="admin-property-info">
                  <strong>{property.propertyName}</strong>
                  <p>{property.location}</p>
                  <a href={property.locationLink} target="_blank" rel="noreferrer">
                    Open map link
                  </a>
                  <small>By: {property.createdByAdminName || "Admin"}</small>
                  <div className="admin-property-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => openEditModal(property)}
                      type="button"
                    >
                      ✎ Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteProperty(property._id)}
                      type="button"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="admin-modal-overlay" onClick={closeEditModal}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeEditModal}>×</button>
            <h2>Edit Property</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                placeholder="Property Name"
                value={editFormData.propertyName}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, propertyName: e.target.value }))
                }
              />

              <input
                type="text"
                placeholder="Location"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, location: e.target.value }))
                }
              />

              <input
                type="url"
                placeholder="Location Link"
                value={editFormData.locationLink}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, locationLink: e.target.value }))
                }
              />

              <label>Add More Images (Optional)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setEditImages(Array.from(e.target.files || []))}
              />

              <div className="modal-buttons">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Property"}
                </button>
                <button type="button" onClick={closeEditModal} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRealEstate;
