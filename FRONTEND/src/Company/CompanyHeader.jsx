import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
const CompanyHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("companyId");
    localStorage.removeItem("name");
    
     Cookies.remove('companyToken', { path: '/' });
     toast.success("Logout Successfully");
     setTimeout(() => {
      navigate("/");
     }, 1500);
  };

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
    <div id="CompanyHeader">
         <Toaster position="top-center" reverseOrder={false} />
      <header className="company-header">
        <div className="logo"></div>
        <div className="menu-icon" onClick={toggleSidebar}>
          ☰
        </div>
      </header>

      <div
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          ×
        </button>
        <ul>
          <li>
            <Link onClick={toggleSidebar} to="/CompanyDashboard">
              <i className="fa fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/CompanyJobPost">
              <i className="fa fa-suitcase"></i> Job Post
            </Link>
          </li>
           <li>
            <Link onClick={toggleSidebar} to="/CompanyHRSelected">
              <i className="fa fa-comments"></i> HR Seleted Application
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/CompanyInterviewProcess">
              <i className="fa fa-comments"></i> Interview Process
            </Link>
          </li>
         
          <li>
            <Link onClick={toggleSidebar} to="/CompanyHiredCandidates">
              <i className="fa fa-users"></i> Hired Candidates
            </Link>
          </li>

          {/* <li>
            <Link onClick={toggleSidebar} to="/Settings">
              <i className="fa fa-cog"></i> Settings
            </Link>
          </li> */}
          <li>
            <button onClick={handleLogout}>
              <i className="fa fa-sign-out"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CompanyHeader;
