import { Link } from "react-router-dom";
import { useState } from "react";
import ToggleComponent from "../Components/ToggleComponent";
// import Landing from "./Landing";
import Landingpage from "./Landingpage";
const Recruitment = () => {
  const [showContactPopup, setShowContactPopup] = useState(false);

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
      <div className="featured">
        <Link to="/" className="featured-label featured-recruitment-link">
          RECRUITMENT
        </Link>
        <span className="featured-separator">/</span>
        <Link to="/real-estate" className="featured-real-estate-link">
          REAL ESTATE
        </Link>
      </div>   
      <div className="recruitment-intro">              
        <div className="intro-actions">
          <button type="button" className="intro-action-btn" onClick={() => setShowContactPopup(true)}>
            Connect <i className="fa fa-chevron-circle-right"></i>
          </button>
          <Link to="/real-estate" className="intro-action-btn">
            Real Estate <i className="fa fa-building"></i>
          </Link>
        </div>
      </div>

      {showContactPopup && (
        <div className="contact-popup-overlay" onClick={() => setShowContactPopup(false)}>
          <div className="contact-popup" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="contact-popup-close"
              onClick={() => setShowContactPopup(false)}
            >
              ×
            </button>
            <div className="contact-popup-title">Connect</div>
            <div className="contact-popup-name">Suryansh</div>
            <div className="contact-popup-number">+91 93245 04318</div>
            <a
              className="contact-popup-whatsapp"
              href="https://wa.me/919324504318"
              target="_blank"
              rel="noreferrer"
              aria-label="Open WhatsApp"
            >
              <i className="fa fa-whatsapp"></i>
            </a>
          </div>
        </div>
      )}
    </div>
    <Landingpage/>
    </div>
  )
}

export default Recruitment;
