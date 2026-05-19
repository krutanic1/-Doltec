import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyList } from '../hooks/useRealEstate';
import PropertyCard from '../components/PropertyCard';

const TABS = [
  { label: 'Buy', value: 'BUY' },
  { label: 'Rent', value: 'RENT' },
  { label: 'New Projects', value: 'PROJECTS' },
  { label: 'Commercial', value: 'COMMERCIAL' },
];

const CITIES = [
  { label: 'Bengaluru', value: 'bengaluru', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80' },
  { label: 'Mumbai', value: 'mumbai', img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=500&q=80' },
  { label: 'Pune', value: 'pune', img: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=500&q=80' },
  { label: 'Hyderabad', value: 'hyderabad', img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=500&q=80' },
];

const TRUST_STATS = [
  { value: '25,000+', label: 'Verified Listings' },
  { value: '10,000+', label: 'Happy Owners' },
  { value: '99%', label: 'Trust Score' },
];

const WHY_US = [
  { icon: '✓', title: 'RERA Verified', desc: 'Every property undergoes multi-stage RERA and legal verification.' },
  { icon: '↑', title: 'Market Intelligence', desc: 'Data-driven insights on locality trends, pricing, and infrastructure.' },
];

const QUICK_ACTIONS = [
  { title: 'Saved Properties', desc: 'Revisit shortlisted listings in one place.', to: '/real-estate/saved', cta: 'Open Saved' },
  { title: 'Compare Listings', desc: 'Side-by-side property comparison for faster decisions.', to: '/real-estate/compare', cta: 'Compare Now' },
  { title: 'Post Property', desc: 'Publish your listing and start collecting leads.', to: '/real-estate/post-property', cta: 'List Free' },
];

const S = {
  font: 'Inter,sans-serif',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('BUY');
  const [q, setQ] = useState('');

  const { data, loading } = usePropertyList({ limit: 4, status: 'APPROVED' });
  const properties = Array.isArray(data) ? data : data?.data || [];

  const doSearch = () => {
    const p = new URLSearchParams();
    p.set('intent', tab === 'RENT' ? 'RENT' : 'BUY');
    if (tab === 'PROJECTS')   p.set('segment', 'PROJECTS');
    if (tab === 'COMMERCIAL') p.set('segment', 'COMMERCIAL');
    if (q) p.set('q', q);
    navigate(`/real-estate/properties?${p}`);
  };

  return (
    <div style={{ background: '#fff', fontFamily: S.font }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
        paddingTop: 120, paddingBottom: 96,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(59,130,246,.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(147,197,253,.06)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 30,
            background: 'rgba(59,130,246,.12)', border: '1px solid rgba(96,165,250,.2)',
            marginBottom: 24, color: '#93c5fd', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.1em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
            India's Most Trusted Property Portal
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900, color: '#fff',
            margin: '0 0 18px', letterSpacing: '-.04em', lineHeight: 1.12, maxWidth: 700,
          }}>
            Find a home you'll{' '}
            <span style={{ color: '#60a5fa' }}>love to live in.</span>
          </h1>
          <p style={{ color: '#93c5fd', fontSize: 17, fontWeight: 500, margin: '0 0 48px', maxWidth: 540, lineHeight: 1.6 }}>
            Browse thousands of verified listings. From luxury villas to budget apartments — find your perfect match.
          </p>

          {/* Search card */}
          <div style={{ maxWidth: 820, background: '#fff', borderRadius: 16, padding: 8, boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }} className="re-search-tabs">
              {TABS.map(t => (
                <button key={t.value} onClick={() => setTab(t.value)} style={{
                  padding: '9px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontFamily: S.font, fontSize: 13, fontWeight: 700, transition: 'all .15s',
                  background: tab === t.value ? '#2563eb' : 'transparent',
                  color: tab === t.value ? '#fff' : '#475569',
                  whiteSpace: 'nowrap',
                }}
                  onMouseOver={e => { if (tab !== t.value) e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseOut={e => { if (tab !== t.value) e.currentTarget.style.background = 'transparent'; }}
                >{t.label}</button>
              ))}
            </div>
            {/* Search row */}
            <div style={{ display: 'flex', gap: 8 }} className="re-search-row">
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 10, padding: '0 16px', border: '1.5px solid #e2e8f0' }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text" placeholder="Enter locality, project or builder…"
                  value={q} onChange={e => setQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    fontFamily: S.font, fontSize: 14, fontWeight: 500, color: '#0f172a', padding: '14px 0',
                    width: '100%',
                  }}
                />
              </div>
              <button onClick={doSearch} style={{
                background: '#2563eb', color: '#fff', border: 'none',
                padding: '14px 28px', borderRadius: 10, fontFamily: S.font,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37,99,235,.3)', transition: 'background .15s',
                whiteSpace: 'nowrap',
              }}
                onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
              >Search Properties</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STATS BAR ───────────────────────────────── */}
      <section style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 0 }}>
          {TRUST_STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: '28px 32px', textAlign: 'center', flex: '1 1 160px',
              borderRight: i < TRUST_STATS.length - 1 ? '1px solid #e2e8f0' : 'none',
            }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#2563eb', margin: '0 0 4px', letterSpacing: '-.03em' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK ACTIONS ───────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: '#2563eb', margin: '0 0 8px' }}>New Tools</p>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-.03em' }}>Saved and compare are now live</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: '8px 0 0', fontWeight: 500 }}>Jump straight into the new flows from the homepage.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="re-quick-grid">
            {QUICK_ACTIONS.map((action) => (
              <div key={action.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 24, boxShadow: '0 10px 30px rgba(15,23,42,.04)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: 20, fontWeight: 900, marginBottom: 16 }}>
                  {action.title[0]}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>{action.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 18px' }}>{action.desc}</p>
                <button onClick={() => navigate(action.to)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', width: '100%' }}>
                  {action.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE CITIES ────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: '#2563eb', margin: '0 0 8px' }}>Browse by City</p>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-.03em' }}>Explore Top Cities</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: '8px 0 0', fontWeight: 500 }}>Find your next home in India's prime localities</p>
            </div>
            <button style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}>View All Cities →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="re-city-grid">
            {CITIES.map(city => (
              <div key={city.value}
                onClick={() => navigate(`/real-estate/properties?city=${city.value}`)}
                style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', position: 'relative', cursor: 'pointer' }}
                onMouseOver={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'; }}
                onMouseOut={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}
              >
                <img src={city.img} alt={city.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#fff' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', opacity: .75, margin: '0 0 4px' }}>Explore</p>
                  <p style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-.02em' }}>{city.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ─────────────────────────────── */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: '#2563eb', margin: '0 0 8px' }}>Handpicked</p>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-.03em' }}>Featured Properties</h2>
              <p style={{ fontSize: 15, color: '#64748b', margin: '8px 0 0', fontWeight: 500 }}>Exclusive projects with premium amenities</p>
            </div>
            <button onClick={() => navigate('/real-estate/properties')} style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}>View All →</button>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="re-card-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ borderRadius: 18, background: '#e2e8f0', aspectRatio: '4/5', animation: 'pulse 1.4s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }} className="re-card-grid">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="re-why-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: '#2563eb', margin: '0 0 12px' }}>Our Commitment</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', margin: '0 0 40px', letterSpacing: '-.03em', lineHeight: 1.15 }}>
              Redefining trust in<br /><span style={{ color: '#94a3b8' }}>Indian Real Estate.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {WHY_US.map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 20 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: '#eff6ff', border: '1.5px solid #dbeafe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: '#2563eb', fontWeight: 900,
                  }}>{item.icon}</div>
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(37,99,235,.12)', border: '6px solid #fff' }}>
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
                alt="Premium Home"
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Stats float */}
            <div style={{
              position: 'absolute', bottom: -24, left: -24,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
              padding: '20px 28px', boxShadow: '0 12px 40px rgba(0,0,0,.1)',
              display: 'flex', gap: 28,
            }}>
              <div>
                <p style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-.03em' }}>25k+</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>Properties</p>
              </div>
              <div style={{ width: 1, background: '#f1f5f9' }} />
              <div>
                <p style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-.03em' }}>10k+</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: 0 }}>Verified Owners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
          borderRadius: 24, padding: '64px 48px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(37,99,235,.25)',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#fff', margin: '0 0 16px', letterSpacing: '-.03em' }}>
              Ready to post your property?
            </h2>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 16, margin: '0 0 36px', fontWeight: 500 }}>
              Join 10,000+ owners who have already sold or rented their properties through us — for free.
            </p>
            <button onClick={() => navigate('/real-estate/post-property')} style={{
              background: '#fff', color: '#2563eb', border: 'none',
              padding: '15px 40px', borderRadius: 12, fontFamily: S.font,
              fontWeight: 800, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,.15)', transition: 'all .15s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
              onMouseOut={e => e.currentTarget.style.background = '#fff'}
            >Post Your Property — Free</button>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
        @media (max-width:1024px){.re-card-grid,.re-city-grid,.re-quick-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media (max-width:720px){
          .re-why-grid{grid-template-columns:1fr!important;gap:48px!important}
          section:first-of-type { padding: 80px 0 60px !important; }
        }
        @media (max-width:640px){
          .re-search-row { flex-direction: column !important; }
          .re-search-row > * { width: 100% !important; }
          .re-search-tabs { justify-content: center; }
        }
        @media (max-width:500px){.re-card-grid,.re-city-grid,.re-quick-grid{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
