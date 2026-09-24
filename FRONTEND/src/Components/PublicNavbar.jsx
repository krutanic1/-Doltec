import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerlogo from '../assets/headerlogo.png';
import '../Style/LandingPageNew.css';

const PublicNavbar = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
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

      <div className="lp-mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={menuOpen ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      {menuOpen && (
        <div className="lp-mobile-menu">
          <Link to="/consultancy" onClick={() => setMenuOpen(false)}>Consultancy</Link>
          <Link to="/real-estate" onClick={() => setMenuOpen(false)}>Real Estate</Link>
          <Link to="/About" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/ContactUs" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          <hr />
          {!isRealEstate && (
            <Link to="/StudentLogIn" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
          <Link to="/ContactUs" className="lp-btn-primary" style={{marginTop: 10, textAlign: 'center'}} onClick={() => setMenuOpen(false)}>Post a Requirement</Link>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
