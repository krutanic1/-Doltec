import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../API";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Cookies from "js-cookie";

const Home = () => {
  const [joblist, setJoblist] = useState([]);
  const [date, setDate] = useState(new Date());
  const [count, setCount] = useState();

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/company-all-jobs`);
      const sortedJobs = response.data
        .filter((item) => item && item.hrId != "" && item.hrName != "")
        .sort((a, b) => new Date(b.jobPostedOn) - new Date(a.jobPostedOn))
        .slice(0, 5);
      setJoblist(sortedJobs);
    } catch (error) {
      console.error("Fetch jobs error:", error.message);
    }
  };

  const fetchCounts = async () => {
    const token = Cookies.get("authToken");
    try {
      const response = await axios.get(`${API}/userdashboardcount`, {
        headers: { Authorization: token },
      });
      setCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCounts();
  }, []);

  const navigate = useNavigate();
  const handleJumpToJobDetail = () => {
    navigate("/Joblist");
  };

  const resume = () => {
    navigate("/Resume");
  };

  return (
    <div id="userdashboard">
      <div className="user__container">
        <div className="table__container">
          <h2>Latest jobs</h2>
          <div className="joblist">
            {joblist.map((job, index) => (
              <div className="latestjobcard" key={index}>
                <div className="companyName">
                  <h3>{job.companyName}</h3>
                  <h3>Hiring</h3>
                  <h3>{new Date(job.jobPostedOn).toLocaleDateString()}</h3>
                </div>
                <div
                  className="redirecttojob"
                  onClick={() => handleJumpToJobDetail()}
                >
                  {" "}
                  See More <i class="fa fa-external-link-square"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="side__table">
          <h2>Application Status</h2>
          <div className="card__containers">
            <div className="counter__card">
              <div className="content">
                <i class="fa fa-hourglass" style={{ color: "blue" }}></i>
                <h2>Pending</h2>
              </div>
              <div className="count">{count?.pending}</div>
            </div>
            <div className="counter__card">
              <div className="content">
                <i class="fa fa-check" style={{ color: "green" }}></i>
                <h2>Selected</h2>
              </div>
              <div className="count">{count?.shortListed}</div>
            </div>
            <div className="counter__card">
              <div className="content">
                <i class="fa fa-times" style={{ color: "red" }}></i>
                <h2>Rejected</h2>
              </div>
              <div className="count">{count?.rejected}</div>
            </div>
            <div className="counter__card resume">
              <div className="content">
                <i class="fa fa-file-pdf-o" style={{ color: "red" }}></i>
                <h2>Last Resume Updated</h2>
              </div>
              <div className="count">
                {count?.resumesUpdatedAt
                  ? new Date(count.resumesUpdatedAt).toLocaleDateString()
                  : "Kindly Create Resume first"}
              </div>
              <button onClick={resume} className="updatebtn">
                UPDATE
              </button>
            </div>
          </div>
          <div className="calendar__container">
            <Calendar onChange={setDate} value={date} />
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;
