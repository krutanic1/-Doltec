import { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const HRHome = () => {
  const [count, setCount] = useState();

  const hrId = localStorage.getItem("HrId");
  const fetchCounts = async () => {
    try {
      const response = await axios.get(`${API}/hrdashboardcount/${hrId}`);
      setCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    fetchCounts();
  }, []);

  const countNo = [
     {
      title: "Total Jobs Assigned",
      count: count?.assignedjobs,
      icons: (
        <i
          style={{ color: "blue" }}
          className="fa fa-tasks"
          aria-hidden="true"
        ></i>
      ),
    },
    {
      title: "Application Recevied",
      count: count?.applicationreceived,
      icons: (
        <i
          style={{ color: "orange" }}
          className="fa fa-briefcase"
          aria-hidden="true"
        ></i>
      ),
    },
    {
      title: "ShortListed",
      count: count?.shortListed,
      icons: (
        <i
          style={{ color: "green" }}
          className="fa fa-handshake-o"
          aria-hidden="true"
        ></i>
      ),
    },
    {
      title: "Rejected",
      count: count?.rejectedwhileinterview,
      icons: (
        <i
          style={{ color: "red" }}
          className="fa fa-times"
          aria-hidden="true"
        ></i>
      ),
    },
  ];

  return (
    <div id="hr__profile">
      <div className="counter__container">
        <div className="jobposted__count">
          {countNo.map((item, index) => (
            <div key={index} className="No__boxes">
              <div className="box">
                <span>{item.icons}</span> <h2>{item.title}</h2>
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRHome;
