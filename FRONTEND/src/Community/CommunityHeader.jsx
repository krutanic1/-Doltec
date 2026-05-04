import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import API from "../API";

const CommunityHeader = () => {
  // const userData = JSON.parse(localStorage.getItem("com-user") || "{}");
  // const userId = userData.userId;
  // const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("com-user");
    alert("Logout Successful");
    navigate("/");
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
    <div id="studentHeader">
      <header className="student-header">
        <div className="logo">
          <h2>Dashboard</h2>
        </div>
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
            <Link onClick={toggleSidebar} to="/CommunityDashboard">
              <i className="fa fa-house"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/CommunityPrivateChat">
              <i class="fa fa-comments-o"></i> Private Chats
            </Link>
          </li>
          <li>
            <Link onClick={toggleSidebar} to="/CommunityPosts">
              <i class="fa fa-clipboard"></i> Your Post
            </Link>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fa fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityHeader;