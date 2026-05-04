import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import API from "../API";
const HRHeader = () => {
  const hrId = localStorage.getItem("HrId");
    const [hrs , setHrs]  = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
     localStorage.removeItem("HrId");
     Cookies.remove('hrToken', { path: '/' });
    alert("Logout Successfully");
    navigate("/");
  };
  const fetchHrs = async () => {
    try {
      const response = await axios.get( `${API}/gethr/${hrId}`);
      console.log(response.data);
      setHrs(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchHrs();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div id="HRHeader">
      <header className="HR-header">
        <div className="logo"> {
          hrs &&  hrs.map((hr) => (
              <strong>{hr.name}'s Dashboard</strong>
      )  )}</div>
        <div className="menu-icon" onClick={toggleSidebar}>
          ☰
        </div>
      </header>

      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      >
        <button className="close-btn" onClick={toggleSidebar}>
          ×
        </button>
        <ul>
          <li>
            <Link onClick={toggleSidebar} to="/HRHome">
              <i className="fa fa-house"></i> Home
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/CompanyJoblist">
              <i className="fa fa-briefcase"></i> Company Job List
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/JobApplications">
              <i className="fa fa-users"></i> Job Applications
            </Link>
          </li>
           <li>
            <Link onClick={toggleSidebar} to="/SelectedCandidates">
              <i className="fa fa-user-check"></i> Selected Candidates
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/InterviewProcess">
              <i className="fa fa-comments"></i> Interview Process
            </Link>
          </li>
         
          <li>
            <Link onClick={toggleSidebar} to="/RejectedCandidates">
              <i className="fa fa-user-times"></i> Rejected Candidates
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/HiredCandidates">
              <i className="fa fa-user-tie"></i> Hired Candidates
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/CompanyOnboard">
                <i className="fa fa-building"></i> Company Onboard list
            </Link>
          </li>
          <li>
            <Link onClick={handleLogout}>
              <i className="fa fa-right-from-bracket"></i> Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HRHeader;
