import { Link } from 'react-router-dom';
import '../Style/LandingPageNew.css';

const LandingPage = () => {
  return (
    <div className="lp-wrapper">

      {/* HERO SECTION */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <h1 className="lp-hero-title">
            Build teams, digital products and better property opportunities.
          </h1>
          <p className="lp-hero-desc">
            Doltec helps businesses hire the right people, build reliable digital solutions, and connect with property opportunities—all through one trusted partner.
          </p>
          <div className="lp-hero-actions">
            <Link to="/ContactUs" className="lp-hero-btn-primary">
              Tell Us What You Need
            </Link>
            <a href="#landing-services" className="lp-hero-btn-secondary">
              Explore Services
            </a>
          </div>
          <p className="lp-hero-trust">For businesses, job seekers, property owners and buyers.</p>
        </div>
        <div className="lp-hero-image-wrap">
          <img 
            src="/images/hero.jpg" 
            alt="Professional Business and Real Estate" 
          />
        </div>
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

      {/* FULLSCREEN SERVICES SECTION (SPACEX STYLE) */}
      <div id="landing-services" className="lp-services-fullscreen-container">
        
        {/* Service 1: Hiring */}
        <section className="lp-fullscreen-section" style={{backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000')"}}>
          <div className="lp-fullscreen-overlay"></div>
          <div className="lp-fullscreen-content">
            <h2 className="lp-fs-title">HIRING SOLUTIONS</h2>
            <p className="lp-fs-desc">We will hire and post the jobs. Find candidates for your growing team and streamline your hiring pipeline.</p>
            <Link to="/consultancy" className="lp-fs-btn">
              GET STARTED <span className="lp-fs-arrow">&rarr;</span>
            </Link>
          </div>
        </section>

        {/* Service 2: IT Services */}
        <section className="lp-fullscreen-section" style={{backgroundImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2000')"}}>
          <div className="lp-fullscreen-overlay"></div>
          <div className="lp-fullscreen-content">
            <h2 className="lp-fs-title">IT SERVICES & SOLUTIONS</h2>
            <p className="lp-fs-desc">We post and build projects. Get custom websites, applications, and IT support designed to create real impact.</p>
            <Link to="/consultancy" className="lp-fs-btn">
              GET STARTED <span className="lp-fs-arrow">&rarr;</span>
            </Link>
          </div>
        </section>

        {/* Service 3: Real Estate */}
        <section className="lp-fullscreen-section" style={{backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000')"}}>
          <div className="lp-fullscreen-overlay"></div>
          <div className="lp-fullscreen-content">
            <h2 className="lp-fs-title">REAL ESTATE</h2>
            <p className="lp-fs-desc">List or discover verified residential and commercial properties through a clearer, transparent process.</p>
            <Link to="/real-estate" className="lp-fs-btn">
              GET STARTED <span className="lp-fs-arrow">&rarr;</span>
            </Link>
          </div>
        </section>

      </div>

      {/* INNOVATIVE HOW IT WORKS SECTION */}
      <section className="lp-how-innovative">
        {/* Background glowing orbs */}
        <div className="lp-how-orb-1"></div>
        <div className="lp-how-orb-2"></div>

        <div className="lp-container">
          <div className="lp-how-header-in">
            <h2 className="lp-how-title-in">Simple from first enquiry to final outcome</h2>
          </div>
          
          <div className="lp-how-grid-in">
            {/* Animated pathway line */}
            <div className="lp-how-path"></div>
            
            {/* Step 1 */}
            <div className="lp-how-card-in">
              <div className="lp-how-number-bg">01</div>
              <div className="lp-how-icon-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="lp-how-title-card">Share your requirement</h4>
              <p className="lp-how-desc-card">
                Tell us whether you need talent, a digital solution or a property opportunity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="lp-how-card-in">
              <div className="lp-how-number-bg">02</div>
              <div className="lp-how-icon-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="lp-how-title-card">Get the right support</h4>
              <p className="lp-how-desc-card">
                Our team understands your needs and connects you with relevant options.
              </p>
            </div>

            {/* Step 3 */}
            <div className="lp-how-card-in">
              <div className="lp-how-number-bg">03</div>
              <div className="lp-how-icon-wrap">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="lp-how-title-card">Move forward confidently</h4>
              <p className="lp-how-desc-card">
                Track progress, communicate easily and take the next step with absolute clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEON AUDIENCE SECTION */}
      <section className="lp-audience-neon">
        <div className="lp-container">
          <div className="lp-audience-header-neon">
            <h2 className="lp-audience-title-neon">Built for people and businesses with real goals</h2>
          </div>
          
          <div className="lp-audience-grid-neon">
            {/* Neon Card 1: Hiring */}
            <Link to="/consultancy" className="lp-neon-card">
              <div className="lp-neon-icon">
                <svg viewBox="0 0 100 100" className="lp-svg-neon">
                  {/* Outer glowing ring (Lime) */}
                  <circle cx="50" cy="50" r="36" stroke="#c0df16" strokeWidth="3" fill="none" strokeDasharray="160 40" strokeDashoffset="20" strokeLinecap="round" />
                  {/* Inner ring */}
                  <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                  {/* Bars */}
                  <rect x="35" y="55" width="4" height="10" fill="#a0aec0" rx="2" />
                  <rect x="45" y="45" width="4" height="20" fill="#cbd5e1" rx="2" />
                  <rect x="55" y="35" width="4" height="30" fill="#f8fafc" rx="2" />
                  <rect x="65" y="25" width="4" height="40" fill="#ffffff" rx="2" />
                </svg>
              </div>
              <h4 className="lp-neon-title">employers & job seekers</h4>
            </Link>
            
            {/* Neon Card 2: Businesses */}
            <Link to="/consultancy" className="lp-neon-card">
              <div className="lp-neon-icon">
                <svg viewBox="0 0 100 100" className="lp-svg-neon">
                  {/* Outer rounded square (Lime) */}
                  <rect x="15" y="20" width="60" height="60" rx="8" stroke="#c0df16" strokeWidth="4" fill="none" strokeDasharray="140 100" strokeDashoffset="0" strokeLinecap="round" />
                  {/* Flag pole */}
                  <line x1="30" y1="30" x2="30" y2="80" stroke="#a0aec0" strokeWidth="4" strokeLinecap="round" />
                  {/* Flag */}
                  <path d="M30 35 H65 L55 45 L65 55 H30" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="lp-neon-title">businesses & IT services</h4>
            </Link>

            {/* Neon Card 3: Property */}
            <Link to="/real-estate" className="lp-neon-card">
              <div className="lp-neon-icon">
                <svg viewBox="0 0 100 100" className="lp-svg-neon">
                  {/* Outer rounded square (Lime/partial) */}
                  <path d="M40 20 H70 A10 10 0 0 1 80 30 V50" stroke="#c0df16" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M60 80 H30 A10 10 0 0 1 20 70 V50" stroke="#c0df16" strokeWidth="4" fill="none" strokeLinecap="round" />
                  {/* Arrow Right (White) */}
                  <path d="M10 35 H65 L55 25 M65 35 L55 45" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Arrow Left (Lime) */}
                  <path d="M90 65 H35 L45 55 M35 65 L45 75" stroke="#c0df16" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="lp-neon-title">property owners & buyers</h4>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY DOLTEC SECTION (SPACEX FULLSCREEN FEATURE) */}
      <section className="lp-why-spacex">
        <div className="lp-why-spacex-overlay"></div>
        <div className="lp-why-spacex-content">
          <h4 className="lp-why-spacex-subtitle">WHY DOLTEC</h4>
          <h2 className="lp-why-spacex-title">ONE TRUSTED PARTNER.<br/>THREE POWERFUL SOLUTIONS.</h2>
          
          <div className="lp-why-spacex-grid">
            <div className="lp-why-spacex-item">
              <h3>CLEAR COMMUNICATION</h3>
              <p>Simple guidance at every stage.</p>
            </div>
            <div className="lp-why-spacex-item">
              <h3>PRACTICAL SOLUTIONS</h3>
              <p>Services designed around real business needs.</p>
            </div>
            <div className="lp-why-spacex-item">
              <h3>FOCUSED SUPPORT</h3>
              <p>Dedicated help instead of confusing processes.</p>
            </div>
            <div className="lp-why-spacex-item">
              <h3>MULTIPLE SERVICES</h3>
              <p>Hiring, IT and real estate under one brand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="lp-cta">
        <div className="lp-cta-box">
          <img src="/images/cta_bg.jpg" alt="" className="lp-cta-bg" />
          
          <div className="lp-cta-content">
            <h2 className="lp-cta-title">Have a requirement? Let’s make it happen.</h2>
            <p className="lp-cta-desc">
              Whether you are hiring, planning a digital project, or looking to list or find a property, Doltec is ready to help.
            </p>
            <div className="lp-cta-actions">
              <Link to="/ContactUs" className="lp-cta-btn-primary">
                Post a Requirement
              </Link>
              <Link to="/ContactUs" className="lp-cta-btn-secondary">
                Contact Doltec
              </Link>
            </div>
            <p className="lp-cta-trust">Prefer to talk? Connect with our team today.</p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default LandingPage;

