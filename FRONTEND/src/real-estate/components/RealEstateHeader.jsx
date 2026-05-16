import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../../assets/headerlogo.png';


const NAV = [
  { label: 'Buy', to: '/real-estate/properties?intent=BUY' },
  { label: 'Rent', to: '/real-estate/properties?intent=RENT' },
  { label: 'New Projects', to: '/real-estate/properties?segment=PROJECTS' },
  { label: 'Commercial', to: '/real-estate/properties?segment=COMMERCIAL' },
  { label: 'Insights', to: '#' },
];

export default function RealEstateHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = (to) => location.pathname + location.search === to;

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,.97)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,.07)' : 'none',
        transition: 'box-shadow .25s, background .25s',
        height: 68,
      }}>
        <div style={{
          maxWidth: 1380, margin: '0 auto', padding: '0 24px',
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>

          {/* Left: Logo */}
          <Link to="/real-estate" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <img src={headerLogo} alt="Logo" style={{ height: 40, width: 'auto', display: 'block', filter: 'brightness(0)' }} />
          </Link>

          {/* Center: Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="re-desktop-nav">
            {NAV.map(n => (
              <Link key={n.label} to={n.to} style={{
                textDecoration: 'none',
                padding: '7px 14px',
                borderRadius: 9,
                fontFamily: 'Inter,sans-serif',
                fontSize: 13.5,
                fontWeight: 600,
                color: isActive(n.to) ? '#2563eb' : '#334155',
                background: isActive(n.to) ? '#eff6ff' : 'transparent',
                transition: 'all .15s',
              }}
                onMouseOver={e => { if (!isActive(n.to)) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#2563eb'; } }}
                onMouseOut={e => { if (!isActive(n.to)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; } }}
              >{n.label}</Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Saved */}
            <Link to="/real-estate/saved" title="Saved" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: 9, background: '#f8fafc',
              border: '1px solid #e2e8f0', color: '#64748b', textDecoration: 'none', transition: 'all .15s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </Link>

            <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />

            {user ? (
              <Link to="/real-estate/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 8px',
                borderRadius: 30, border: '1.5px solid #e2e8f0', background: '#fff',
                textDecoration: 'none', transition: 'all .15s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.background = '#eff6ff'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: 11,
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }} className="re-desktop-nav">My Account</span>
              </Link>
            ) : (
              <Link to="/real-estate/login" style={{
                textDecoration: 'none', fontSize: 13.5, fontWeight: 700,
                color: '#334155', padding: '7px 14px', borderRadius: 9,
                transition: 'color .15s',
              }}
                onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
                onMouseOut={e => e.currentTarget.style.color = '#334155'}
              >Login</Link>
            )}

            <Link to="/real-estate/post-property" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#2563eb', color: 'white',
              padding: '9px 20px', borderRadius: 10,
              fontWeight: 700, fontSize: 13.5, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,99,235,.25)',
              transition: 'all .15s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,.35)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,.25)'; }}
              className="re-desktop-only"
            >
              Post Property
              <span style={{
                background: '#10b981', fontSize: 9, fontWeight: 800,
                padding: '2px 6px', borderRadius: 4, letterSpacing: '.06em', textTransform: 'uppercase',
              }}>FREE</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="re-mobile-only"
              style={{
                display: 'none', width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 9,
                color: '#334155', cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: '#fff', borderTop: '1px solid #e2e8f0',
            padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ marginBottom: 12, paddingLeft: 14 }}>
              <img src={headerLogo} alt="Logo" style={{ height: 32, width: 'auto', filter: 'brightness(0)' }} />
            </div>
            {NAV.map(n => (
              <Link key={n.label} to={n.to}
                style={{
                  textDecoration: 'none', padding: '11px 14px', borderRadius: 9,
                  fontSize: 14, fontWeight: 600,
                  color: isActive(n.to) ? '#2563eb' : '#334155',
                  background: isActive(n.to) ? '#eff6ff' : 'transparent',
                }}
              >{n.label}</Link>
            ))}
            <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />
            <Link to="/real-estate/post-property" style={{
              background: '#2563eb', color: 'white', textDecoration: 'none',
              padding: '13px', borderRadius: 10, fontWeight: 700, textAlign: 'center',
            }}>Post Property — Free</Link>
          </div>
        )}
      </header>

      {/* Responsive style injection */}
      <style>{`
        @media (max-width: 900px) { .re-desktop-nav { display: none !important; } }
        @media (max-width: 700px) { .re-desktop-only { display: none !important; } }
        @media (max-width: 900px) { .re-mobile-only { display: flex !important; } }
      `}</style>
    </>
  );
}
