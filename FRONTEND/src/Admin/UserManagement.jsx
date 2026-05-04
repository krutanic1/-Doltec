import React, { useEffect, useState } from 'react';
import API from '../API';
import axios from 'axios';

const UserManagement = () => {
  const [responses, setResponses] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API}/allusers`);
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
      const response = await axios.post(`${API}/increment-user-job-limit`, { userId });
      alert(response.data.message);
      await fetchAllUsers();
    } catch (error) {
      alert('Failed to update job limit: ' + (error.response?.data?.message || error.message));
    }
  };
  return (
   <div id="contactresponse">
     <div className="contactus-container">
      <h2 className="contactus-title">Users List</h2>
      <div className="user__container">
      <table className="contactus-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Assigned Limit</th>
            <th>Action</th>
            <th>Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {responses.length > 0 ? (
            responses.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name || 'N/A'}</td>
                <td>{item.email || 'N/A'}</td>
                <td>{item.phone || 'N/A'}</td>
                <td>{item.jobLimit || 0}</td>
                <td>
                  <button
                  title='Add Limits'
                    className="add-limit-button"
                    onClick={() => handleAddJobLimit(item._id)}
                  >
                   <i class="fa fa-sliders"></i>
                  </button>
                </td>
               <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-response">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
   </div>
  );
};

export default UserManagement;