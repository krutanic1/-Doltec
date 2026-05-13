import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Style/RealEstateNavbar.css';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const query = new URLSearchParams(location.search);

  const isPropertiesPage = location.pathname === '/real-estate/properties';
  const activeIntent = query.get('intent');
  const activeSegment = query.get('segment');

  const navLinks = [
    { label: 'Buy', to: '/real-estate/properties?intent=BUY', active: isPropertiesPage && activeIntent === 'BUY' },
    { label: 'Rent', to: '/real-estate/properties?intent=RENT', active: isPropertiesPage && activeIntent === 'RENT' },
    { label: 'Commercial', to: '/real-estate/properties?segment=COMMERCIAL', active: isPropertiesPage && activeSegment === 'COMMERCIAL' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/real-estate/login';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="re-navbar-wrap">
      <div className="container re-navbar">
        <div className="re-navbar-left">
          <Link to="/real-estate" className="re-brand" onClick={closeMenu}>
            DOLTEC <span className="re-brand-dot">.</span>
          </Link>

          <div className="re-nav-links re-nav-links-desktop">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className={`re-nav-link ${link.active ? 'is-active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="re-navbar-right">
          {user ? (
            <div className="re-auth-actions">
              <Link to="/real-estate/dashboard" className="re-btn re-btn-muted" onClick={closeMenu}>Dashboard</Link>
              <button onClick={handleLogout} className="re-btn re-btn-danger">Logout</button>
            </div>
          ) : (
            <div className="re-auth-actions">
              <Link to="/real-estate/login" className="re-btn re-btn-muted" onClick={closeMenu}>Log In</Link>
              <Link to="/real-estate/register" className="re-btn re-btn-primary" onClick={closeMenu}>Sign Up</Link>
            </div>
          )}

          <button
            type="button"
            className="re-nav-toggle"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="re-nav-mobile-panel">
          <div className="container re-nav-mobile-content">
            <div className="re-nav-links re-nav-links-mobile">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`re-nav-link ${link.active ? 'is-active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="re-auth-actions re-auth-mobile">
                <Link to="/real-estate/dashboard" className="re-btn re-btn-muted" onClick={closeMenu}>Dashboard</Link>
                <button onClick={handleLogout} className="re-btn re-btn-danger">Logout</button>
              </div>
            ) : (
              <div className="re-auth-actions re-auth-mobile">
                <Link to="/real-estate/login" className="re-btn re-btn-muted" onClick={closeMenu}>Log In</Link>
                <Link to="/real-estate/register" className="re-btn re-btn-primary" onClick={closeMenu}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
