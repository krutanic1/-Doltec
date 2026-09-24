import React from 'react';
import '../Style/AboutNew.css';


const About = () => {
  return (
    <div className="about-wrapper">

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Powering the Future of Work & Spaces</h1>
          <p>
            At Doltec, we believe hiring and acquiring should be intelligent, inclusive, and instant. We are building the next-generation platform where elite talent meets opportunity and real estate meets innovation—seamlessly and at scale.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="about-mission-vision">
        <div className="about-mv-grid">
          
          <div className="about-mv-card">
            <div className="about-mv-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h2>Our Mission</h2>
            <p>
              To reimagine the intersection of talent and technology. We aim to simplify the hiring lifecycle for both organizations and applicants, fostering meaningful connections that drive careers and fuel exponential business growth.
            </p>
          </div>

          <div className="about-mv-card">
            <div className="about-mv-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <h2>Our Vision</h2>
            <p>
              To build a talent-centric tomorrow. We bridge the gap between education and employment by empowering professionals and recruiters with highly intelligent tools, equal access, and unparalleled transparency.
            </p>
          </div>

        </div>
      </section>

      {/* OUR STORY / TIMELINE */}
      <section className="about-story">
        <div className="about-story-header">
          <h2>Built to Solve Real Challenges</h2>
          <p>
            Born out of frustration with traditional fragmented processes, Doltec was founded by industry veterans who saw the need for a single, intelligent platform. From day one, we've focused on removing friction and maximizing visibility for every stakeholder.
          </p>
        </div>

        <div className="about-timeline">
          <div className="about-timeline-item">
            <div className="about-timeline-number">01</div>
            <h4>Ideation</h4>
            <p>Identified key bottlenecks in hiring and real estate, conceptualizing a unified platform.</p>
          </div>
          
          <div className="about-timeline-item">
            <div className="about-timeline-number">02</div>
            <h4>Prototype Built</h4>
            <p>Developed our MVP focusing on deep integration and complete pipeline transparency.</p>
          </div>

          <div className="about-timeline-item">
            <div className="about-timeline-number">03</div>
            <h4>Beta Launched</h4>
            <p>Piloted the technology with early adopters from top-tier tech hiring teams.</p>
          </div>

          <div className="about-timeline-item">
            <div className="about-timeline-number">04</div>
            <h4>Live Deployment</h4>
            <p>Expanded the platform across enterprise-scale clients with a massive feature rollout.</p>
          </div>

          <div className="about-timeline-item">
            <div className="about-timeline-number">05</div>
            <h4>Future Vision</h4>
            <p>Deploying AI-driven matching and predictive analytics directly into the roadmap.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;

