import { Link } from "react-router-dom";
import ToggleComponent from "../Components/ToggleComponent";
// import Landing from "./Landing";
import Landingpage from "./Landingpage";
const Recruitment = () => {
  return (
    <div id="demo">
    <div className="demo__content">
      <nav className="newbar">

        <ul className="d-flex navbar-link">
          <li>
            <Link to="/StudentLogIn">
              Apply For Jobs
            </Link>
          </li>
          <li className="logo">
            <span className="circle-border">
              <Link to="/ITServices">
                <ToggleComponent />
              </Link>
            </span>
            {/* <Link to="/HRLogin" >
              Team
            </Link> */}
          </li>
          <li>
            <Link to="/CompanyLogin">
            Post a job and hire
            </Link>
          </li>
        </ul>
      </nav>
      <div className="center__content">
        <div className="M-text">Hiring Process</div>
        <div className="doltec__text">
          <div className="XL-text">Doltec</div>
          <div className="L-text">Doltec</div>
        </div>
        <div className="text-M">BUILDING AWARENESS WITH WISDOM</div>
        <div className="social-icons">
          <span>
            <i className="fa fa-instagram"></i>
          </span>
          <span>
            <i className="fa fa-facebook"></i>
          </span>
          <span>
            <i className="fa fa-twitter"></i>
          </span>
          <span>
            <i className="fa fa-linkedin"></i>
          </span>
          <span>
            <i className="fa fa-youtube"></i>
          </span>
          <span>
            <i className="fa fa-github"></i>
          </span>  
        </div>
      </div>
      <div className="featured">RECRUITMENT</div>
      <div className="recruitment-intro">
        <Link to="/ContactUs"><button> Get Started <i class="fa fa-chevron-circle-right"></i></button></Link>
      </div>
    </div>
    <Landingpage/>
    </div>
  )
}

export default Recruitment;
