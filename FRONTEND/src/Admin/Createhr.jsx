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
    <div id="createhr">
      <div className="hr-container">
        {/* <h2 className="hr-title">Create New HR Account</h2> */}
        <div className="hr-form-wrapper">
          <form onSubmit={handleSubmit} className="hr-form">
            <div>
              <input
                type="text"
                value={formData.name}
                placeholder="Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="hr-input"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="hr-input"
                required
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.number}
                placeholder="Number"
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="hr-input"
                required
              />
            </div>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="hr-input"
              />
              <span
                onClick={handleTogglePasswordVisibility}
                className="toggle-icon"
              >
                {!showPassword ? (
                  <i class="fa fa-eye-slash"></i>
                ) : (
                  <i class="fa fa-eye"></i>
                )}
              </span>
            </div>
            <div>
              <button type="submit" className="hr-button">
                {isEditMode ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <h2 className="hr-table-title">HR's List</h2>
        <div className="hr-table-container">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hrs.length > 0 ? (
                hrs.map((hr, index) => (
                  <tr key={hr._id}>
                    <td>{index + 1}</td>
                    <td>{hr.name}</td>
                    <td>{hr.email}</td>
                    <td>{hr.number}</td>
                    <td>
                      <button onClick={handleEdit(hr)}>
                        <i class="fa fa-pencil-square-o"></i>
                      </button>
                      <button
                        onClick={handleDelete(hr._id)}
                        title="Delete"
                        style={{ marginLeft: "10px" }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-hr">
                    No HRs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Createhr;
