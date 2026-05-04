import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const CompanyHiredCandidates = () => {
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const companyId = localStorage.getItem("companyId");

  const fetchSelectedApplications = async () => {
    try {
      if (!companyId) {
        console.error("No companyId found, cannot fetch applications");
        return;
      }
      const response = await axios.get(
        `${API}/shortlisted-applications/${companyId}`
      );
      const applicationsWithOfferLetter = await Promise.all(
        response.data.map(async (app) => {
          try {
            const offerLetterResponse = await axios.get(
              `${API}/offer-letter/${app._id}`
            );
            return {
              ...app,
              offerLetter: offerLetterResponse.data.offerLetter,
            };
          } catch (error) {
            console.error(
              `Error fetching offer letter for application ${app._id}:`,
              error
            );
            return { ...app, offerLetter: "Not Assigned" };
          }
        })
      );
      setSelectedApplications(applicationsWithOfferLetter);
    } catch (error) {
      console.error("Error fetching applications:", error);
      alert("Failed to fetch applications. Please try again.");
    }
  };

  const handleFileSelect = (event, applicationId) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > 1024) {
        alert("File size must be under 1MB!");
        return;
      }
      setSelectedFiles((prev) => ({
        ...prev,
        [applicationId]: file,
      }));
    }
  };

  const handleFileUpload = async (application) => {
    const file = selectedFiles[application._id];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("applicationId", application._id);
    try {
      await axios.post(`${API}/upload-offer-letter`, formData);
      alert("File uploaded successfully");
      setSelectedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[application._id];
        return newFiles;
      });
      fetchSelectedApplications();
    } catch (error) {
      console.error("Upload error:", error.response?.data);
      alert(
        `Failed to upload file: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  const updateToHR = async (application) => {
    const confirmation = window.confirm(
      "Are you sure you want to update this application to HR?"
    );
    if (!confirmation) { return; }

    if (
      !application.offerLetter ||
      application.offerLetter === "Not Assigned"
    ) {
      alert("Please upload offer letter first");
      return;
    }
    try {
      const response = await axios.post(`${API}/update-to-hr`, {
        applicationId: application._id,
      });
      if (response.status === 200) {
        alert("Updated to HR successfully");
        fetchSelectedApplications();
      } else {
        alert("Failed to update to HR");
      }
    } catch (error) {
      console.error("Error updating to HR:", error);
      alert("Failed to update to HR. Please try again.");
    }
  };

  useEffect(() => {
    fetchSelectedApplications();
  }, [companyId]);

  return (
    <div id="companyHired">
      <div className="heading">
        <h2 className="job-list-title">Onboarding Candidates</h2>
      </div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Candidate Name</th>
            <th className="header-cell">Applied for Designation</th>
            <th className="header-cell">Applied on</th>
            <th className="header-cell">Hiring Status</th>
            <th className="header-cell">Upload Offer Letter</th>
            <th className="header-cell">Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {selectedApplications.length === 0 ? (
            <tr className="no-jobs-row">
              <td className="text-center" colSpan="6">
                No selected candidates found
              </td>
            </tr>
          ) : (
            selectedApplications.map((app, index) => (
              <tr className="jobs-row" key={app._id || index}>
                <td className="table-cell">
                  {app.resumeId?.personalInfo?.name ||
                    app.userId?.name ||
                    "N/A"}
                </td>
                <td className="table-cell">{app.jobId?.jobTitle || "N/A"}</td>
                <td className="table-cell">
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="table-cell">
                  {app.shortListed ? "Shortlisted" : "No"}
                </td>
                <td className="table-cell">
                  {app.offerLetter && app.offerLetter !== "Not Assigned" ? (
                    <a
                      href={app.offerLetter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View{" "}
                      <i
                        className="fa fa-file-pdf-o"
                        style={{ color: "red", marginLeft: "4px" }}
                      />
                    </a>
                  ) : (
                    <div>
                      <input
                        className="file__upload"
                        type="file"
                        accept=".pdf, .doc, .docx"
                        onChange={(e) => handleFileSelect(e, app._id)}
                      />
                      {selectedFiles[app._id] && (
                        <button
                          onClick={() => handleFileUpload(app)}
                          style={{
                            marginLeft: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  <button
                    className="update__btn"
                    onClick={() => updateToHR(app)}
                    disabled={app.updateHR}
                  >
                    {app.updateHR ? "Already Updated" : "Update to HR"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyHiredCandidates;
