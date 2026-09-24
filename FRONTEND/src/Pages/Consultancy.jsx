import React from 'react';
import { Link } from 'react-router-dom';
import AllJobsPage from './AllJobs';
import '../Style/Consultancy.css';
import '../Style/LandingPageNew.css';


const Consultancy = () => {
  // The active jobs logic is now handled by the embedded AllJobsPage component

  return (
    <div className="con-wrapper">

      {/* HERO SECTION */}
      <section className="con-hero">
        <div className="con-hero-content">
          <h1>Accelerate your growth with expert consultancy.</h1>
          <p>
            Connect with us to post your active jobs, find the right talent, or build scalable tech solutions tailored to your business goals.
          </p>
          <div className="con-hero-actions">
            <Link to="/ContactUs" className="con-btn-primary">Post a Job</Link>
            <a href="#solutions" className="con-btn-secondary">Explore Solutions</a>
          </div>
        </div>
      </section>

      {/* ACTIVE JOBS SECTION (AllJobsPage Embedded) */}
      <section className="con-jobs-embedded">

        <AllJobsPage />
      </section>

      {/* CONTINUOUS LOGO MARQUEE */}
      <section className="lp-marquee-section">
        <p className="lp-marquee-title">Trusted by innovative companies worldwide</p>
        <div className="lp-marquee-container">
          <div className="lp-marquee-track">
            {/* First Set of Logos */}
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" alt="Meta" /></a>
            
            {/* Duplicated Set for Seamless Loop */}
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" /></a>
            <a href="#" className="lp-marquee-logo"><img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" alt="Meta" /></a>
          </div>
        </div>
      </section>

      {/* TECH SOLUTIONS SECTION */}
      <section id="solutions" className="con-solutions">
        <div className="con-container">
          <div className="con-section-header">
            <h2>Our Tech Solutions</h2>
            <p>Professional, simple, and user-friendly digital services to scale your business.</p>
          </div>
          
          <div className="con-solutions-grid">
            <div className="con-solution-card con-solution-card-db">
              <div className="con-sol-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              </div>
              <h3>Database Management</h3>
              <p>Secure, optimized, and scalable database architecture for your growing data needs.</p>
            </div>

            <div className="con-solution-card con-solution-card-saas">
              <div className="con-sol-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3>SaaS Services</h3>
              <p>Reliable Software as a Service solutions hosted securely on the cloud for seamless access.</p>
            </div>

            <div className="con-solution-card con-solution-card-biz">
              <div className="con-sol-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </div>
              <h3>Business Counseling</h3>
              <p>Expert consulting to optimize your operations, team structure, and IT strategy.</p>
            </div>

            <div className="con-solution-card con-solution-card-custom">
              <div className="con-sol-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h3>Custom Building</h3>
              <p>Tailored web and mobile applications designed to solve your unique business challenges.</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Consultancy;

