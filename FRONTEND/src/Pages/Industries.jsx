
import highlightgif from "../assets/highlight.gif";
import {Link} from "react-router-dom";

const Industries = () => {
  const industries = [
  {
    name: "Information Technology",
    icon: "💻",
    description: "Software, AI, Data Science jobs and more.",
  },
  {
    name: "Healthcare",
    icon: "🩺",
    description: "Nursing, clinical research, and health tech roles.",
  },
  {
    name: "Finance",
    icon: "💰",
    description: "Banking, FinTech, accounting, and more.",
  },
  {
    name: "Engineering",
    icon: "🏗️",
    description: "Mechanical, Civil, and Electrical engineering jobs.",
  },
  {
    name: "Education",
    icon: "🎓",
    description: "Teaching, EdTech, curriculum design roles.",
  },
  {
    name: "Marketing & Sales",
    icon: "📈",
    description: "Digital marketing, sales, and brand roles.",
  },
];
  return (
    <div id="industries">
      <div className="industries-page">
        {/* Hero Section */}
        <section className="hero">
          <div id="hero__content">
            <h2>Industries We Serve</h2>
            <p>Tailored recruitment experiences for every sector.</p>
            <p>Highlight Doltec's adaptability and how you power hiring in multiple verticals—startup to enterprise.</p>
          </div>
        </section>

        {/* Industry Cards */}
        <section className="industry">
            <h2>Our Specialized Domains</h2>
           <div className="industry-grid">
             {industries.map((industry, index) => (
            <div className="industry-card" key={index}>
              <div className="icon">{industry.icon}</div>
              <h3>{industry.name}</h3>
              <p>{industry.description}</p>
            </div>
          ))}
           </div>
        </section>

        {/*Industry-Specific Solutions */}
        <section className="why-doltec">
           <h2>Industry-Specific Solutions</h2>
           <div className="specific__flex">
            <div className="highlight__img">
              <img src={highlightgif} alt="" />
            </div>
            <div className="highlight__contect">
              <div className="content__point">
                <h3><i class="fa fa-dot-circle-o"></i> Tech-Driven Filters for IT Roles</h3>
                <p>AI-powered role matchers tailored to software and cloud job descriptions.</p>
              </div>
              <div className="content__point">
                <h3><i class="fa fa-dot-circle-o"></i> Credential Verification for Healthcare</h3>
                <p>License and compliance checks to ensure only certified professionals apply.</p>
              </div>
              <div className="content__point">
                <h3><i class="fa fa-dot-circle-o"></i> Bulk Hiring Tools for Retail</h3>
                <p>Seamless high-volume hiring pipeline with smart screening.</p>
              </div>
            </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Industries;
