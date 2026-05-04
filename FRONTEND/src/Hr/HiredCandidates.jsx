import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const HiredCandidates = () => {
  const [selectedApplications, setSelectedApplications] = useState([]);
  const HrId = localStorage.getItem("HrId");

  const fetchHiredApplications = async () => {
    try {
      if (!HrId) {
        console.error("No HrId found, cannot fetch applications");
        return;
      }
      const response = await axios.get(`${API}/hired-applications/${HrId}`);
      setSelectedApplications(response.data);
    } catch (error) {
      console.error("Error fetching hired applications:", error);
      alert("Failed to fetch hired applications. Please try again.");
    }
  };

  const SendOfferLetter = async (applicationId) => {
     const confirmation = window.confirm(
      "Are you sure you want to send the offer letter to this candidate?"
      );
    if (!confirmation) { return; }
    if (!applicationId) {
      console.error("Invalid application ID");
      alert("Cannot send offer letter: Invalid application");
      return;
    }
    try {
      const response = await axios.put(
        `${API}/application/${applicationId}/send-offer-letter`
      );
      if (response.status === 200) {
        alert("Offer letter sent successfully");
        await fetchHiredApplications();
      }
    } catch (error) {
      console.error("Error sending offer letter:", error.response?.data || error.message);
      alert(`Error sending offer letter: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  useEffect(() => {
    if (HrId) {
      fetchHiredApplications();
    } else {
      console.error("No HrId found, cannot fetch applications");
    }
  }, [HrId]);

  return (
    <div id="companyHired">
      <div className="heading">
        <h2 className="job-list-title">Hired Candidates</h2>
      </div>
      <table className="job-table">
        <thead className="table-header">
          <tr className="header-row">
            <th className="header-cell">Candidate Name</th>
            <th className="header-cell">Applied for Designation</th>
            <th className="header-cell">Applied on</th>
            <th className="header-cell">Hiring Status</th>
            <th className="header-cell">Offer Letter</th>
            <th className="header-cell">Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {selectedApplications.length === 0 ? (
            <tr className="no-jobs-row">
              <td className="no-jobs-cell" colSpan="6">
                No hired candidates found
              </td>
            </tr>
          ) : (
            selectedApplications.map((app, index) => (
              <tr className="table-tr" key={app._id || index}>
                <td className="table-cell">
                  {app.resumeId?.personalInfo?.name || app.userId?.name || "N/A"}
                </td>
                <td className="table-cell">{app.jobId?.jobTitle || "N/A"}</td>
                <td className="table-cell">
                  {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="table-cell">{app.shortListed ? "Shortlisted" : "No"}</td>
                <td className="table-cell">
                  {app.offerLetter && app.offerLetter !== "Not Assigned" ? (
                    <a href={app.offerLetter} target="_blank" rel="noopener noreferrer">
                     <i class="fa fa-file-pdf-o text-blue-700" title="view offer letter" aria-hidden="true"></i>
                    </a>
                  ) : (
                    "Not Assigned"
                  )}
                </td>
                <td className="table-cell">
                  <button
                    title="send to candidate"
                    className="send-offer-button"
                    onClick={() => SendOfferLetter(app._id)}
                    disabled={app.offerLetterSent}
                  >
                    {app.offerLetterSent ? "already sended" : "Send"}
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

export default HiredCandidates;