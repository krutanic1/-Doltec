import React from 'react';
import { Link } from 'react-router-dom';
import headerLogo from '../../assets/coni.jpg';


const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '#' },
      { label: 'Contact Us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
    ],
  },
  {
    title: 'Buyers',
    links: [
      { label: 'Buy Property', to: '/real-estate/properties?intent=BUY' },
      { label: 'New Projects', to: '/real-estate/properties?segment=PROJECTS' },
      { label: 'Home Loans', to: '#' },
      { label: 'Market Insights', to: '#' },
    ],
  },
  {
    title: 'Sellers',
    links: [
      { label: 'Post Property', to: '/real-estate/post-property' },
      { label: 'Seller Guide', to: '#' },
      { label: 'Builder Services', to: '#' },
      { label: 'Pricing Calculator', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacypolicy' },
      { label: 'Terms & Conditions', to: '/termsandconditions' },
      { label: 'RERA Compliance', to: '#' },
      { label: 'Safety Tips', to: '#' },
    ],
  },
];

const S = {
  footer: {
    background: '#0f172a',
    color: '#94a3b8',
    fontFamily: 'Inter,sans-serif',
    paddingTop: 64,
    paddingBottom: 32,
    borderTop: '1px solid #1e293b',
  },
  inner: {
    maxWidth: 1380,
    margin: '0 auto',
    padding: '0 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    gap: 40,
    marginBottom: 56,
  },
  brand: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  brandLink: {
    display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
  },
  brandName: {
    fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-.02em',
  },
  tagline: {
    fontSize: 13, color: '#64748b', lineHeight: 1.65, maxWidth: 280,
  },
  socials: { display: 'flex', gap: 10 },
  socialBtn: {
    width: 36, height: 36, borderRadius: '50%',
    background: '#1e293b', border: '1px solid #334155',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#64748b', cursor: 'pointer', transition: 'all .15s',
  },
  colTitle: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '.1em', color: '#f1f5f9', marginBottom: 16,
  },
  linkList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  link: { textDecoration: 'none', fontSize: 13, color: '#64748b', transition: 'color .15s', fontWeight: 500 },
  bottom: {
    paddingTop: 28, borderTop: '1px solid #1e293b',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 12,
  },
  copy: { fontSize: 12, color: '#475569' },
  status: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#475569' },
  statusDot: { width: 7, height: 7, borderRadius: '50%', background: '#10b981' },
};

export default function RealEstateFooter() {
  return (
    <footer style={S.footer}>
      <div style={S.inner}>
        {/* Grid */}
        <div style={S.grid} className="re-footer-grid">
          {/* Brand */}
          <div style={S.brand}>
            <Link to="/real-estate" style={S.brandLink}>
              <img src={headerLogo} alt="Logo" style={{ height: 36, width: 'auto' }} />
            </Link>
            <p style={S.tagline}>
              India's most trusted property marketplace for buying, selling, and renting premium real estate.
              Verified listings and expert assistance.
            </p>
            <div style={S.socials}>
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(s => (
                <a key={s} href="#" title={s}
                  style={S.socialBtn}
                  onMouseOver={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563eb'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#334155'; }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'inherit' }}>{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {COLUMNS.map(col => (
            <div key={col.title}>
              <p style={S.colTitle}>{col.title}</p>
              <ul style={S.linkList}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} style={S.link}
                      onMouseOver={e => e.currentTarget.style.color = '#60a5fa'}
                      onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                    >{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={S.bottom}>
          <p style={S.copy}>© 2026 Doltec Properties India Pvt. Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <span style={S.copy}>Made in India 🇮🇳</span>
            <div style={S.status}>
              <span style={S.statusDot} />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .re-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .re-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
