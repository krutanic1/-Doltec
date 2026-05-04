const services = [
  {
    title: "Job Posting for CompaniesJob Posting & Talent Discovery",
    icon: "📢",
    description:
      "Instantly publish jobs and connect with top-tier candidates using intelligent matching.",
  },
  {
    title: "End-to-End Hiring Workflow",
    icon: "🔄",
    description:
      "From screening to offer letter—run your full recruitment lifecycle in one place.",
  },
  {
    title: "AI-Powered Resume Parsing",
    icon: "🤖",
    description:
      "Eliminate manual screening with smart filters and scoring models.",
  },
  {
    title: "Interview Management System",
    icon: "📅",
    description:
      "Schedule, conduct, and evaluate interviews with in-platform tools and integrations.",
  },
  {
    title: "Employer Branding Tools",
    icon: "🏢",
    description:
      "Create branded company pages, promote your culture, and attract passive talent.",
  },
  {
    title: "Candidate Experience Optimization",
    icon: "✨",
    description:
      "Personalized dashboards, real-time updates, and smart notifications for applicants.",
  },
];
import { Link } from "react-router-dom";
import jobseeker from "../assets/job-seekers.png";

const Services = () => {
  return (
    <div id="services">
      <div className="services-page">
        {/* Hero Section */}
        <section className="our__hero">
          <div className="our__hero__content">
            <h2>End-to-End Recruitment, Reinvented</h2>
            <p>
              Explore our suite of modern, AI-powered hiring services designed
              for today's job market.
            </p>
            <div>
              <Link to="/CompanySignup">
                <button>Explore Features</button>
              </Link>
              <Link to="/ContactUs">
                <button>Request a Demo</button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-grid">
          <h2>What We Offer</h2>
          <div className="service__card">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recruiter-Specific Services */}
        <section className="how-it-works">
          <h2>For Recruiters & Hiring Teams</h2>
          <div className="steps">
            <div className="step">
              <h3>Role-Based Access</h3>
              <p>
                Assign permissions to recruiters, HR, and managers within one
                unified system.
              </p>
            </div>
            <div className="step">
              <h3>Collaboration Tools</h3>
              <p>
                Share feedback, compare candidates, and align decisions through
                one platform.
              </p>
            </div>
            <div className="step">
              <h3>Analytics & Reporting</h3>
              <p>
                Track hiring performance, candidate activity, and pipeline
                metrics in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Job Seeker Services */}
        <div className="job__seekers">
          <h2>Empower Job Success</h2>
          <div className="seeker__container">
            <div className="left__img">
              <img src={jobseeker} alt="" />
            </div>
            <div className="right__content">
              <div className="steps">
                <div className="step">
                  <h3>Smart Job Recommendations</h3>
                  <p>Jobs tailored to you</p>
                </div>
                <div className="step">
                  <h3>Application Tracking</h3>
                  <p>Track status instantly</p>
                </div>
                <div className="step">
                  <h3>Resume Builder & Templates</h3>
                  <p>Build resumes effortlessly</p>
                </div>
                <div className="step">
                  <h3>Interview Scheduling</h3>
                  <p>Book slots with ease</p>
                </div>
                <div className="step">
                  <h3>Notifications & Alerts</h3>
                  <p>Never miss updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add-On / Premium Services */}
        <div className="preminm__services">
          <h2>Advanced Services & Integrations</h2>
          <p>Supercharge your hiring with Doltec's premium solutions.</p>

          <div className="preminum__container">
            <div className="preminum__card">
              <h3>🔗 API Access for Enterprise Systems</h3>
            </div>
            <div className="preminum__card">
              <h3>🌐 White-labeled Career Portals</h3>
            </div>
            <div className="preminum__card">
              <h3>🧠 Third-party Assessment Integrations</h3>
            </div>
            <div className="preminum__card">
              <h3>🔍 Background Verification Partners</h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
