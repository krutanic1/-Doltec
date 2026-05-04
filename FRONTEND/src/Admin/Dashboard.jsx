import axios from "axios";
import { useEffect, useState } from "react";
import API from '../API';

const Dashboard = () => {

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
    <div id="admindashboard">
    <div className="dashboard-container">
      <div className="kpi-grid">
        {countNo.map((item, index) => (
          <div key={index} className="kpi-card">
            <h2 className="kpi-count">{item.count}</h2>
            <p className="kpi-title">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  
  )
}

export default Dashboard
