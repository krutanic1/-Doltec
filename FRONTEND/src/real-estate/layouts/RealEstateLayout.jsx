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
  inner: {
    maxWidth: 1280, margin: '0 auto', padding: '0 32px',
    height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
  },
  logoText: { fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' },
  logoBadge: {
    background: '#2563eb', color: '#fff', fontSize: 10,
    fontWeight: 700, padding: '2px 7px', borderRadius: 4,
  },
  nav: { display: 'flex', alignItems: 'center', gap: 28 },
  navLink: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  postBtn: {
    background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
    padding: '7px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer',
  },
  footer: { background: '#111827', color: '#6b7280', padding: '56px 32px 32px' },
  footerInner: { maxWidth: 1280, margin: '0 auto' },
  footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24,
    fontSize: 12, textAlign: 'center', color: '#4b5563',
  },
};

function REHeader() {
  const nav = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  return (
    <header style={S.header}>
      <div style={S.inner}>
        {/* Logo */}
        <Link to="/real-estate" style={S.logo}>
          <span style={S.logoText}>Doltec</span>
          <span style={S.logoBadge}>ESTATES</span>
        </Link>
 
        {/* Nav */}
        <nav style={S.nav}>
          {[['Buy', '/real-estate?type=buy'], ['Rent', '/real-estate?type=rent'],
            ['New Launch', '/real-estate?type=new-launch'], ['Commercial', '/real-estate?type=commercial']
          ].map(([label, to]) => (
            <Link key={label} to={to} style={S.navLink}>{label}</Link>
          ))}
            <Link to="/real-estate/workspace" style={{ ...S.navLink, color: '#e2e8f0' }}>Workspace</Link>
        </nav>
 
        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <Link to="/real-estate/dashboard" style={{
              display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: 11,
              }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="re-desktop-only">My Account</span>
            </Link>
          ) : (
            <Link to="/real-estate/auth/login" style={{
              color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', transition: 'color .15s',
            }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
            >
              Sign In
            </Link>
          )}

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />

          <button style={S.postBtn} onClick={() => nav('/real-estate/post')}>
            Post Property <span style={{ color: '#4ade80', fontWeight: 900 }}>FREE</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function REFooter() {
  return (
    <footer style={S.footer}>
      <div style={S.footerInner}>
        <div style={S.footerGrid}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Doltec</span>
              <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>ESTATES</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 260 }}>
              India's trusted property marketplace. Verified listings, direct owner connect, zero hassle.
            </p>
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#0f172a' }}>
      <REHeader />
      <Outlet />
      <REFooter />
    </div>
  );
}
