import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../API";

const CompanyDashboar = () => {
  const [company, setCompany] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`${API}/company/${companyId}`);
        setCompany(response.data);
      } catch (error) {
        alert(
          "Failed to fetch company profile. Please try again or contact support."
        );
      }
    };

  useEffect(() => {
    if (!companyId) {
      navigate("/login");
      return;
    }
    fetchCompanyProfile();
  }, [companyId, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 50 * 1024) { 
      alert("File is too large. Please select an image smaller than 50KB.");
      setFile(null);
      fileInputRef.current.value = "";
      return;
    }
    setFile(selectedFile || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }
    if (isUploading) {
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(`${API}/upload-logo/${companyId}`, {
          image: reader.result,
        });
        if (response.status === 200) {
          alert("Logo uploaded successfully!");
          setFile(null);
          fileInputRef.current.value = "";
          setCompany({
            ...company,
            companyLogoUrl: response.data.companyLogoUrl,
          });
        } else {
           alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        if (error.code === "ERR_NETWORK") {
          alert("Network error: Unable to reach the server. Please check your connection or try again later.");
        } else if (error.response) {
          alert(`Upload failed: ${error.response.data.message || "Server error"}`);
        } else {
          alert("Error uploading logo. Please try again.");
        }
        alert("Failed to upload logo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!company) return <div>Loading...</div>;



  return (
    <div id="company-profile">
      <div className="profile">
          <div className="company-logo-section">
        <form onSubmit={handleUpload} className="logo-upload-form">
          <div className="logo-upload-container group">
            <img
              src={company.companyLogoUrl || "/default-logo.png"}
              alt="Company Logo"
              className="logo-img"
            />
            <label className="overlay-label">
              <i className="fa fa-edit icon-style"></i>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label> 
          </div>
          <button
            type="submit"
            className="upload-btn"
            disabled={!file || isUploading}
            onClick={() => (!file || isUploading)}
          >
            {isUploading ? "Uploading..." : "Update"}
          </button>
        </form>
         </div>
         <div className="company-details">
        <h2>{company.companyName}</h2>
        <p>
          <strong>Type:</strong> {company.companyType}
          {company.otherCompanyType && ` (${company.otherCompanyType})`}
        </p>
        <p>
          <strong>Position:</strong> {company.position}
        </p>
        <p>
          <strong>Business Model:</strong> {company.businessmodel}
        </p>
        <p>
          <strong>Email:</strong> {company.email}
        </p>
         </div>
       
      </div>
      
         <div className="instructions-section">
        <h3>📘 How to Use the Dashboard</h3>
        <ol>
          <li><strong>View Profile:</strong> Your company profile details are displayed here.</li>
          <li><strong>Update Logo:</strong> Click the edit icon on the logo to upload (max 50KB).</li>
          <li><strong>Before Posting Jobs:</strong> Ensure your company logo is uploaded, otherwise you cannot post.</li>
          <li><strong>Confirm Actions:</strong> Always confirm before selecting, rejecting, or uploading offer letters.</li>
          <li><strong>Navigation:</strong> Use the sidebar for jobs, applications, and settings.</li>
          <li><strong>Support:</strong> Contact support if you face any issues <a href="mailto:support@doltec.in"><i class="fa fa-envelope" aria-hidden="true"></i></a></li>
        </ol>
      </div>
      
    </div>
  );
};

export default CompanyDashboar;