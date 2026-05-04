import Platform__Overview from "../assets/Platform__Overview.png";
import whychoose from "../assets/whychoosedoltec.png";
import { Link } from "react-router-dom";
const Overview = () => {
  return (
    <div id="overview">
      {/* Hero Section */}
      <section className="hero-section">
        <div id="content__hero">
          <h2>Welcome to Doltec</h2>
          <p>Revolutionizing Recruitment With Doltec.</p>
          <button>
            <Link to="/CompanySignup">JOIN US</Link>
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>What is Doltec?</h2>
        <div className="Platform__Overview">
          <div className="step">
            <p>
              Doltec is a comprehensive recruitment engine that bridges the gap
              between employers and job seekers. From job posting to onboarding,
              every step is handled within a secure, intelligent, and
              user-friendly platform.
            </p>
            <ul>
              <li>
                <i className="fa fa-shield"></i> Security
              </li>
              <li>
                <i className="fa fa-users"></i> Speed
              </li>
              <li>
                <i className="fa fa-android"></i> Intelligence
              </li>
              <li>
                <i className="fa fa-universal-access"></i> Workflow
              </li>
            </ul>
          </div>
          <div className="step">
            <img className="step__shadow" src={Platform__Overview} alt="" />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="key-features">
        <h2>Key Features</h2>
        <div className="features">
          <div className="feature">
            <h3>Unified Talent Ecosystem</h3>
            <p>
              Access candidates, live jobs, recruiter tools, and workflows—all
              under one roof.
            </p>
          </div>
          <div className="feature">
            <h3>Smart Job Discovery</h3>
            <p>
              Users see only the most relevant jobs through intelligent
              filtering and interest mapping.
            </p>
          </div>
          <div className="feature">
            <h3>Effortless Collaboration</h3>
            <p>
              Recruiters can invite managers to review, rate, and discuss
              candidates on the platform.
            </p>
          </div>
          <div className="feature">
            <h3>Automated Interview Scheduling</h3>
            <p>
              Sync calendars and let Doltec handle interview slots, reminders,
              and rescheduling.
            </p>
          </div>
          <div className="feature">
            <h3>Document Vault & Offer Manager</h3>
            <p>
              Securely manage resumes, portfolios, contracts, and offer letters
              in a centralized location.
            </p>
          </div>
          <div className="feature">
            <h3>Customizable Job Workflows</h3>
            <p>
              Tailor the recruitment pipeline to your process with drag-and-drop
              stage configuration.
            </p>
          </div>
        </div>
      </section>

      {/* why choose doltec */}
      <section className="success-stories">
        <h2>Why Choose Doltec?</h2>
        <div className="whychoose">
          <img src={whychoose} alt="why choose doltec ?" />
        </div>
      </section>
    </div>
  );
};

export default Overview;
