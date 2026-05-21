/* ─────────────────────────────────────────────────────
   src/real-estate/layouts/RealEstateLayout.jsx
   Premium Shell: sticky glassmorphism header + outlet + footer
───────────────────────────────────────────────────── */
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import '../re.css';

const NAV_LINKS = [
  ['Buy',        '/real-estate?type=buy'],
  ['Rent',       '/real-estate?type=rent'],
  ['New Launch', '/real-estate?type=new-launch'],
  ['Commercial', '/real-estate?type=commercial'],
  ['Workspace',  '/real-estate/workspace'],
];

const FOOTER_COLS = [
  { title: 'Platform',  links: ['Buy Property', 'Rent Property', 'New Launch', 'Commercial Spaces', 'Post Property'] },
  { title: 'Company',   links: ['About Doltec', 'Help Center', 'Blog', 'Careers', 'Privacy Policy'] },
  { title: 'Top Cities', links: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Chennai'] },
];

function UserAvatar({ user, size = 32 }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 900, fontSize: size * 0.38,
      border: '2px solid rgba(116,143,252,0.4)',
      flexShrink: 0,
    }}>
      {initial}
    </div>
  );
}

function REHeader() {
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className="re-header" style={{
      background: scrolled ? 'rgba(11,15,26,0.96)' : 'rgba(11,15,26,0.90)',
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
      boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.38)' : '0 2px 20px rgba(0,0,0,0.22)',
    }}>
      <div className="re-header-inner">
        {/* Logo */}
        <Link to="/real-estate" className="re-logo">
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900, color: '#fff',
            boxShadow: '0 4px 12px rgba(59,91,219,0.4)',
          }}>D</div>
          <span className="re-logo-text">Doltec</span>
          <span className="re-logo-badge">Estates</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="re-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {NAV_LINKS.map(([label, to]) => {
            const isActive = location.pathname.startsWith(to.split('?')[0]) && to !== '/real-estate';
            return (
              <Link key={label} to={to} className="re-nav-link" style={{
                color: isActive ? '#fff' : 'rgba(255,255,255,0.62)',
                borderBottom: isActive ? '2px solid #faa219' : '2px solid transparent',
                paddingBottom: 2,
              }}>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="re-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <Link to="/real-estate/dashboard" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '7px 14px 7px 10px',
              borderRadius: 100,
              transition: 'all 0.18s ease',
            }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <UserAvatar user={user} size={26} />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700 }}>
                {user.name?.split(' ')[0] || 'Account'}
              </span>
            </Link>
          ) : (
            <Link to="/real-estate/auth/login" style={{
              color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              padding: '8px 16px',
              transition: 'color 0.18s',
            }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              Sign In
            </Link>
          )}
          <button
            className="re-btn re-btn-gold re-btn-sm"
            style={{ borderRadius: 100, letterSpacing: '-0.01em' }}
            onClick={() => nav('/real-estate/post-property')}
          >
            + Post Property
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="re-hide-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user && <Link to="/real-estate/dashboard"><UserAvatar user={user} size={32} /></Link>}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: menuOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 10,
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: 18,
              lineHeight: 1,
              transition: 'background 0.18s',
            }}
          >{menuOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={{
          background: 'rgba(11,15,26,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '12px 20px 24px',
          animation: 'reFadeIn 0.2s ease',
        }}>
          {NAV_LINKS.map(([label, to]) => (
            <Link key={label} to={to}
              style={{
                display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 15,
                fontWeight: 600, textDecoration: 'none',
                padding: '13px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => nav('/real-estate/post-property')}
            style={{
              marginTop: 16, width: '100%',
              background: 'linear-gradient(135deg, #faa219, #e8890c)',
              color: '#0f1629', border: 'none',
              borderRadius: 14, padding: '14px',
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            + Post Property — FREE
          </button>
        </div>
      )}
    </header>
  );
}

function REFooter() {
  return (
    <footer className="re-footer">
      <div className="re-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 40, marginBottom: 52 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 900, color: '#fff',
              }}>D</div>
              <span className="re-footer-logo-text">Doltec Estates</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(255,255,255,0.45)', maxWidth: 220 }}>
              India's trusted premium property marketplace. Verified listings, direct owner connect, zero hassle.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {['𝕏', 'in', 'f', 'yt'].map(s => (
                <div key={s} style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >{s}</div>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <p className="re-footer-section-title">{title}</p>
              {links.map(l => <a key={l} href="#" className="re-footer-link">{l}</a>)}
            </div>
          ))}
        </div>

        <div className="re-footer-bottom">
          © {new Date().getFullYear()} Doltec Estates Pvt. Ltd. All rights reserved. · Built in India 🇮🇳
        </div>
      </div>
    </footer>
  );
}

export default function RealEstateLayout() {
  return (
    <div className="re-module" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <REHeader />
      <Outlet />
      <REFooter />
    </div>
  );
}
