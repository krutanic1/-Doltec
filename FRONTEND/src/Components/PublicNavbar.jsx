import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerlogo from '../assets/headerlogo.png';
import '../Style/LandingPageNew.css';

const PublicNavbar = () => {
  const { pathname } = useLocation();
  const isRealEstate = pathname.toLowerCase().startsWith('/real-estate');

  return (
    <nav className="lp-nav">
      <Link to="/" className="lp-brand">
        <img src={headerlogo} alt="Doltec Logo" />
      </Link>

      <div className="lp-nav-links">
        <Link to="/consultancy">Consultancy</Link>
        <Link to="/real-estate">Real Estate</Link>
        <Link to="/About">About Us</Link>
        <Link to="/ContactUs">Contact Us</Link>
      </div>

      <div className="lp-nav-actions">
        {/* Login button hidden on real-estate pages — they have their own Sign In in the tab strip */}
        {!isRealEstate && (
          <Link to="/StudentLogIn" className="lp-btn-outline">Login</Link>
        )}
        <Link to="/ContactUs" className="lp-btn-primary">Post a Requirement</Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
