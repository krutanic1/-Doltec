import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../../assets/headerlogo.png';

const NAV = [
  { label: 'Buy',          to: '/real-estate/properties?intent=BUY' },
  { label: 'Rent',         to: '/real-estate/properties?intent=RENT' },
  { label: 'New Projects', to: '/real-estate/properties?segment=PROJECTS' },
  { label: 'Commercial',   to: '/real-estate/properties?segment=COMMERCIAL' },
  { label: 'Saved',        to: '/real-estate/saved' },
  { label: 'Compare',      to: '/real-estate/compare' },
];

export default function RealEstateHeader() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const location = useLocation();
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const isActive = (to) => location.pathname + location.search === to;

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(5,13,26,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,.25)' : 'none',
        transition: 'all .35s cubic-bezier(.4,0,.2,1)',
        height: 72,
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto', padding: '0 28px',
          height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}>
          {/* Logo */}
          <Link to="/real-estate" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <img src={headerLogo} alt="Doltec" style={{ height: 38, width: 'auto', filter: 'brightness(0) invert(1)' }} />
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase',
              color: '#f59e0b', background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.25)',
              padding: '3px 8px', borderRadius: 4,
            }}>Estates</span>
          </Link>

          {/* Center Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="re-desktop-nav">
            {NAV.map(n => (
              <Link key={n.label} to={n.to} style={{
                textDecoration: 'none',
                padding: '8px 15px', borderRadius: 8,
                fontFamily: 'Inter,sans-serif', fontSize: 13.5, fontWeight: 600,
                color: isActive(n.to) ? '#f59e0b' : 'rgba(255,255,255,.78)',
                background: isActive(n.to) ? 'rgba(245,158,11,.1)' : 'transparent',
                border: isActive(n.to) ? '1px solid rgba(245,158,11,.2)' : '1px solid transparent',
                transition: 'all .18s',
              }}
                onMouseOver={e => { if (!isActive(n.to)) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,.06)'; } }}
                onMouseOut={e => { if (!isActive(n.to)) { e.currentTarget.style.color = 'rgba(255,255,255,.78)'; e.currentTarget.style.background = 'transparent'; } }}
              >{n.label}</Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Heart */}
            <Link to="/real-estate/saved" title="Saved" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)',
              color: 'rgba(255,255,255,.7)', textDecoration: 'none', transition: 'all .18s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(245,158,11,.15)'; e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = 'rgba(245,158,11,.3)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'rgba(255,255,255,.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'; }}
            >
              <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </Link>

            <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,.12)' }} />

            {user ? (
              <Link to="/real-estate/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '6px 14px 6px 8px',
                borderRadius: 30, border: '1px solid rgba(255,255,255,.15)',
                background: 'rgba(255,255,255,.07)', textDecoration: 'none', transition: 'all .18s',
              }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.22)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#050d1a', fontWeight: 900, fontSize: 12,
                }}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.85)' }} className="re-desktop-nav">My Account</span>
              </Link>
            ) : (
              <Link to="/real-estate/login" style={{
                textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
                color: 'rgba(255,255,255,.78)', padding: '8px 14px', borderRadius: 9,
                transition: 'color .18s',
              }}
                onMouseOver={e => e.currentTarget.style.color = '#f59e0b'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,.78)'}
              >Sign In</Link>
            )}

            <Link to="/real-estate/post-property" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#050d1a', padding: '10px 22px', borderRadius: 11,
              fontWeight: 800, fontSize: 13.5, textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(245,158,11,.3)',
              transition: 'all .2s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(245,158,11,.4)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(245,158,11,.3)'; }}
              className="re-desktop-only"
            >
              Post Free
              <span style={{ background: '#050d1a', color: '#f59e0b', fontSize: 9, fontWeight: 900, padding: '2px 5px', borderRadius: 3, letterSpacing: '.06em' }}>FREE</span>
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="re-mobile-only" style={{
              display: 'none', width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)',
              borderRadius: 9, color: '#fff', cursor: 'pointer',
            }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                  d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(5,13,26,.97)', backdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,.06)',
            padding: '20px 20px 28px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {NAV.map(n => (
              <Link key={n.label} to={n.to} style={{
                textDecoration: 'none', padding: '12px 16px', borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                color: isActive(n.to) ? '#f59e0b' : 'rgba(255,255,255,.75)',
                background: isActive(n.to) ? 'rgba(245,158,11,.1)' : 'transparent',
              }}>{n.label}</Link>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '10px 0' }} />
            <Link to="/real-estate/post-property" style={{
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              color: '#050d1a', padding: '14px', borderRadius: 12,
              fontWeight: 800, textAlign: 'center', textDecoration: 'none', display: 'block',
            }}>Post Property — Free</Link>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) { .re-desktop-nav { display: none !important; } }
        @media (max-width: 700px) { .re-desktop-only { display: none !important; } }
        @media (max-width: 900px) { .re-mobile-only { display: flex !important; } }
      `}</style>
    </>
  );
}
