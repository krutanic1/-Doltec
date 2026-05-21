/* ─────────────────────────────────────────────────────
   src/real-estate/layouts/RealEstateLayout.jsx
   Full-page shell: sticky header + outlet + footer
───────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const S = {
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: '#1e1e2e', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
  },
  logoText: { fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' },
  logoBadge: {
    background: '#2563eb', color: '#fff', fontSize: 10,
    fontWeight: 700, padding: '2px 7px', borderRadius: 4,
  },
  navLink: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  postBtn: {
    background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
    padding: '7px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  footer: { background: '#111827', color: '#6b7280', padding: '56px 20px 32px' },
  footerInner: { maxWidth: 1280, margin: '0 auto' },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24,
    fontSize: 12, textAlign: 'center', color: '#4b5563',
  },
};

const NAV_LINKS = [
  ['Buy', '/real-estate?type=buy'],
  ['Rent', '/real-estate?type=rent'],
  ['New Launch', '/real-estate?type=new-launch'],
  ['Commercial', '/real-estate?type=commercial'],
  ['Workspace', '/real-estate/workspace'],
];

function REHeader() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  return (
    <header style={S.header}>
      {/* Main bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Logo */}
        <Link to="/real-estate" style={S.logo} onClick={() => setMenuOpen(false)}>
          <span style={S.logoText}>Doltec</span>
          <span style={S.logoBadge}>ESTATES</span>
        </Link>

        {/* Desktop Nav (hidden on mobile via CSS) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="re-dsk-nav">
          {NAV_LINKS.map(([label, to]) => (
            <Link key={label} to={to} style={S.navLink}>{label}</Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="re-dsk-cta">
          {user ? (
            <Link to="/real-estate/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 11 }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              My Account
            </Link>
          ) : (
            <Link to="/real-estate/auth/login" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          )}
          <button style={S.postBtn} onClick={() => nav('/real-estate/post')}>
            Post <span style={{ color: '#4ade80', fontWeight: 900 }}>FREE</span>
          </button>
        </div>

        {/* Mobile right-side: sign-in icon + hamburger */}
        <div style={{ alignItems: 'center', gap: 8 }} className="re-mob-actions">
          {user ? (
            <Link to="/real-estate/dashboard" style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </Link>
          ) : (
            <Link to="/real-estate/auth/login" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700, textDecoration: 'none', padding: '6px 10px' }}>Sign In</Link>
          )}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#fff', fontSize: 18, lineHeight: 1 }}
            aria-label="Toggle menu"
          >{menuOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{ background: '#1a1a2e', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px 20px' }}>
          {NAV_LINKS.map(([label, to]) => (
            <Link key={label} to={to} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 600, textDecoration: 'none', padding: '13px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {label}
            </Link>
          ))}
          <button onClick={() => { nav('/real-estate/post'); setMenuOpen(false); }}
            style={{ marginTop: 14, width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Post Property — FREE
          </button>
        </div>
      )}

      {/* Responsive styles for header */}
      <style>{`
        .re-dsk-nav { display: flex !important; align-items: center; gap: 20px; }
        .re-dsk-cta { display: flex !important; align-items: center; gap: 12px; }
        .re-mob-actions { display: none !important; }
        @media (max-width: 768px) {
          .re-dsk-nav { display: none !important; }
          .re-dsk-cta { display: none !important; }
          .re-mob-actions { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function REFooter() {
  return (
    <footer style={S.footer}>
      <div style={S.footerInner}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Doltec</span>
              <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>ESTATES</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>India's trusted property marketplace. Verified listings, direct owner connect, zero hassle.</p>
          </div>
          {[
            ['Platform', ['Buy', 'Rent', 'New Launch', 'Post Property']],
            ['Company',  ['About Doltec', 'Help Center', 'Privacy Policy', 'Terms']],
            ['Cities',   ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad']],
          ].map(([title, links]) => (
            <div key={title}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>{title}</p>
              {links.map(l => <p key={l} style={{ fontSize: 13, marginBottom: 12, cursor: 'pointer' }}>{l}</p>)}
            </div>
          ))}
        </div>
        <div style={S.footerBottom}>© {new Date().getFullYear()} Doltec Estates. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function RealEstateLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#0f172a', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      <REHeader />
      <Outlet />
      <REFooter />
    </div>
  );
}
