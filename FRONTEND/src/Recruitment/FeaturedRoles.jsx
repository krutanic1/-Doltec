
const jobs = [
  {
     logo:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1750917952/doltec_company_logo/qvckxn33r4fchern1au4.jpg",
    company: "Krutanic",
    title: "Social Media Marketing",
    location: "Bangalore",
    type: "Full-Time",
    tags: ["Canva", "Adobe Creative Cloud" , "Email Marketing Platforms"],
  },
  {
    logo:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1751270144/doltec_company_logo/rjplrr7zfdrcrijxlywd.jpg",
    company: "Spectrenterprise",
    title: "Financial Advisor",
    location: "Thane, Pune",
    type: "	In Office",
    tags: ["Wealth Management", "Business Development"],
  },
  {
     logo:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1750847466/doltec_company_logo/lxliqcs53jlijjgvqvkv.png",
    company: "Alldigi Tech limited",
    title: "Customer Care Executive",
    location: "Noida",
    type: "Full-Time",
    tags: ["Only Hindi communication" ,"MS Office"],
  },
  // {
  //   company: "NovaTech",
  //   title: "Mobile Intern",
  //   location: "San Francisco, CA",
  //   type: "Internship",
  //   tags: ["React Native"],
  // },
  // {
  //   company: "Bright Labs",
  //   title: "Product Design Intern",
  //   location: "Remote",
  //   type: "Internship",
  //   tags: ["Figma", "UX"],
  // },
  // {
  //   company: "Nimbus",
  //   title: "Backend Intern",
  //   location: "Austin, TX",
  //   type: "Internship",
  //   tags: ["Node.js", "PostgreSQL"],
  // },
];
import {Link} from "react-router-dom";
export default function FeaturedRoles() {
    
  return (
    <div id="featureRoles_landingpage">
        <section id="jobs" className="jobs-section">
      <div className="container">
        <div className="jobs-header">
          <div>
            <h2 className="jobs-title">Featured roles</h2>
            <p className="jobs-subtitle">
              Curated opportunities for students and recent grads.
            </p>
          </div>
          <button className="btn primary hidden-sm"><Link to="/AllJobs">See all roles</Link></button>
        </div>

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={`${job.company}-${job.title}`} className="card">
              <div className="card-header">
                <div className="card-title">
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="company-logo"
                  />
                  <span>{job.title}</span>
                </div>
                <button className="icon-btn" aria-label="Save job">♡</button>
              </div>

              <div className="card-content">
                <div className="job-meta">
                  <span>💼 {job.company}</span>
                  <span>📍 {job.location}</span>
                </div>

                <div className="tags">
                  <span className="badge type">{job.type}</span>
                  {job.tags.map((t) => (
                    <span key={t} className="badge outline">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="card-footer">
                  <button className="btn small primary"><Link to="/AllJobs">Apply</Link></button>
                  <Link to="/AllJobs" className="learn-more">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        {/* <div id="companies" className="companies">
          <p className="trusted-by">Trusted by</p>
          <div className="companies-grid">
            {[
              "https://i.pinimg.com/736x/88/8e/fe/888efe76c7409403b0d02238978064bd.jpg",
             "https://i.pinimg.com/1200x/02/d0/e4/02d0e48bbd56d767163e4c997acb85f7.jpg", 
             "https://i.pinimg.com/736x/a0/61/a9/a061a92e3dd185958caa894cf1467381.jpg", 
             "https://i.pinimg.com/736x/0f/f1/e3/0ff1e3a0544e80c45f4a8d74a8d1f4ef.jpg",
              "https://i.pinimg.com/1200x/21/1c/bb/211cbbac97e26050991d218a6da5a9cf.jpg", 
              "https://i.pinimg.com/736x/c7/dc/ce/c7dccee6ad1b0e20cf19cdfb231a7c39.jpg"
            ].map((name) => (
              <div key={name} className="company-logo-wrap">
                <img
                  src={name}
                  alt={`${name} logo`}
                  className="company-row-logo"
                />
              </div>
            ))}
          </div>
        </div> */}

        <div className="mobile-cta">
        <Link to="/AllJobs"><button className="btn primary w-full">See all roles</button></Link>
        </div>
      </div>
    </section>
    </div>
  );
}
