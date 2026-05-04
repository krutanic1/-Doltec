import { useEffect, useState } from 'react';
import API from '../API';
import axios from 'axios';

const CompanyOnboard = () => {
  const [responses, setResponses] = useState([]);
//    const [showEditForm, setShowEditForm] = useState(false);
//   const [currentCompany, setCurrentCompany] = useState(null);

  const fetchContactUs = async () => {
    try {
      const res = await axios.get(`${API}/allcompany`);
      setResponses(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }
  };

//     const handleAddJobLimit = async (companyId) => {
//       const confirmAddLimit = window.confirm('Are you sure you want to add a job post limit for this company?');
//     if (!confirmAddLimit) {
//       return;
//     }
//     try {
//       const response = await axios.post(`${API}/increment-job-limit`, { companyId });
//       alert(response.data.message);
//        fetchContactUs();
//     } catch (error) {
//       alert('Failed to update job limit: ' + error.response?.data?.message || error.message);
//     }
//   };

//   const handleEditClick = (company) => {
//     setCurrentCompany(company);
//     setShowEditForm(true);
//   };

  // 🔹 Update form fields dynamically
//   const handleFormChange = (e) => {
//     setCurrentCompany({ ...currentCompany, [e.target.name]: e.target.value });
//   };

  // 🔹 Submit form to backend
//   const handleUpdateCompany = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API}/company/${currentCompany._id}`, currentCompany);
//       alert('Company updated successfully');
//       setShowEditForm(false);
//       fetchContactUs();
//     } catch (err) {
//       alert('Error updating company: ' + (err.response?.data?.message || err.message));
//     }
//   };


  useEffect(() => {
    fetchContactUs();
  }, []);

  return (
   <div id="contactresponse">
     <div className="contactus-container">
      <h2 className="contactus-title">Company Onboard List</h2>
       <div className="user__container">
       <table className="contactus-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Position</th>
            {/* <th>Business Model</th> */}
            {/* <th>Limit</th> */}
            {/* <th>Action</th> */}
            <th>D & T</th>
            {/* <th>Edit/Update</th> */}
          </tr>
        </thead>
        <tbody>
          {responses.length > 0 ? (
            responses.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.companyName}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.companyType ? item.companyType : item.otherCompanyType}</td>
                <td>{item.position}</td>
                {/* <td>{item.businessmodel}</td> */}
                {/* <td>{item.jobPostLimit}</td> */}
                {/* <td><button title='Add Job Limits' onClick={() => handleAddJobLimit(item.companyId)} className="add-limit-button"><i class="fa fa-sliders"></i></button></td> */}
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                {/* <td><button onClick={() => handleEditClick(item)}  className="edit-update-btn"><i class="fa fa-pencil-square-o"></i></button></td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-response">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
       </div>
    </div>
     {/* {showEditForm && currentCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Company</h3>
            <form onSubmit={handleUpdateCompany} className="edit-company-form">
              <label>
                Company Name:
                <input name="companyName" value={currentCompany.companyName} onChange={handleFormChange} />
              </label>
              <label>
                Email:
                <input name="email" value={currentCompany.email} onChange={handleFormChange} />
              </label>
              <label>
                Phone:
                <input name="phone" value={currentCompany.phone} onChange={handleFormChange} />
              </label>
              <label>
                Company Type:
                <input name="companyType" value={currentCompany.companyType} onChange={handleFormChange} />
              </label>
              <label>
                Other Company Type:
                <input name="otherCompanyType" value={currentCompany.otherCompanyType} onChange={handleFormChange} />
              </label>
              <label>
                Position:
                <input name="position" value={currentCompany.position} onChange={handleFormChange} />
              </label>
              <label>
                Business Model:
                <input name="businessmodel" value={currentCompany.businessmodel} onChange={handleFormChange} />
              </label>
              <label>
                Job Post Limit:
                <input name="jobPostLimit" value={currentCompany.jobPostLimit} onChange={handleFormChange} />
              </label>
              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )} */}
   </div>
  );
};

export default CompanyOnboard;
