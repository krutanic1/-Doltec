import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../API';

const Dashboard = () => {

    const navigate = useNavigate();
    const [count , setCount] = useState()
    const fetchCounts = async () => {
      try {
        const response = await axios.get( `${API}/admindashboard`);
        setCount(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      fetchCounts();
    }, []);
   
    const countNo = [
      { title: 'Total Students', count: count?.totalUsers },
      { title: 'Total Companies', count: count?.totalCompanies },
      { title: 'Total HRs', count: count?.totalHRs },
      { title: 'Posted Jobs', count: count?.postedJobs },
      { title: 'Assigned Jobs', count: count?.assignedJobs },
      { title: 'Unassigned Jobs', count: count?.unassignedJobs }
    ]

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Admin Overview
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Welcome to the master control panel.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {countNo.map((item, index) => (
            <div key={index} style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"; }}>
              <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                {item.title}
              </div>
              <div style={{ color: "#0f172a", fontSize: "36px", fontWeight: "700" }}>
                {item.count !== undefined ? item.count : "..."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

