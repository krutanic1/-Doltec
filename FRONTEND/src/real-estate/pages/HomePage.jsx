/* ─────────────────────────────────────────────────────
   src/real-estate/pages/HomePage.jsx
   Search-first homepage — Hero + Search + Cities + Grid
───────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyList } from '../hooks/useRealEstate';
import PropertyCard from '../components/PropertyCard';

const TABS  = ['Buy', 'Rent', 'New Launch', 'Commercial', 'Plots'];
const CITIES = [
  { label: 'Bengaluru', value: 'bengaluru' },
  { label: 'Mumbai',    value: 'mumbai'    },
  { label: 'Pune',      value: 'pune'      },
  { label: 'Hyderabad', value: 'hyderabad' },
  { label: 'Chennai',   value: 'chennai'   },
];
const CATS = ['🏠 Apartments','🏡 Villas','📦 Plots','🏢 Commercial','🏗 New Launch','🛏 PG / Co-living'];

export default function HomePage() {
  const navigate  = useNavigate();
  const [tab, setTab]   = useState('Buy');
  const [q,   setQ]     = useState('');
  const [city, setCity] = useState('');

  const { data, loading } = usePropertyList({ limit: 8, status: 'published', ...(city && { city }) });
  const properties = Array.isArray(data) ? data : data?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    p.set('type', tab.toLowerCase());
    if (q)    p.set('q',    q);
    if (city) p.set('city', city);
    navigate(`/real-estate/properties?${p}`);
  };

  const goCity = (v) => {
    setCity(v === city ? '' : v);
    navigate(`/real-estate/properties?city=${v}`);
  };

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ background: '#3b0921', padding: '72px 32px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ color: '#fff' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', opacity: 0.55, textTransform: 'uppercase', marginBottom: 18 }}>Doltec Estates · Verified Listings</p>
            <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: 22 }}>
              Find Your Perfect<br/>Property in India
            </h1>
            <p style={{ fontSize: 16, opacity: 0.75, lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              Verified listings, direct owner connect, zero brokerage surprises. Explore homes, plots and commercial spaces.
            </p>
            <button onClick={() => navigate('/real-estate/properties')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '2px solid rgba(255,255,255,0.8)', color: '#fff', background: 'transparent', padding: '13px 36px', fontWeight: 700, fontSize: 14, cursor: 'pointer', letterSpacing: '0.08em' }}>
              Browse All Listings →
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=560&q=80"
                alt="Modern building" style={{ height: 400, width: 300, objectFit: 'cover', borderRadius: '80px 80px 0 0', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', bottom: -16, left: -20, background: '#eab308', color: '#1a1a1a', padding: '14px 20px', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                ✓ Verified Listings Only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search Module ──────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '16px 20px', fontWeight: 700, fontSize: 13, border: 'none',
                background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                borderBottom: tab === t ? '2px solid #2563eb' : '2px solid transparent',
                color: tab === t ? '#2563eb' : '#94a3b8',
              }}>{t}</button>
            ))}
          </div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 16px', minWidth: 160 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>All Types</span>
              <span style={{ color: '#94a3b8', marginLeft: 'auto' }}>▾</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 16px' }}>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
              <input type="text" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Enter city, locality or project..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontWeight: 500, color: '#0f172a', background: 'transparent' }} />
            </div>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '0 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── City Chips ────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Popular:</span>
          {CITIES.map(c => (
            <button key={c.value} onClick={() => goCity(c.value)} style={{
              padding: '6px 18px', borderRadius: 999, border: '1px solid',
              borderColor: city === c.value ? '#2563eb' : '#e2e8f0',
              background: city === c.value ? '#2563eb' : '#fff',
              color: city === c.value ? '#fff' : '#475569',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{c.label}</button>
          ))}
        </div>
      </section>

      {/* ── Quick Categories ──────────────────────────── */}
      <section style={{ background: '#f8fafc', padding: '48px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 28, letterSpacing: '-0.5px' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {CATS.map(cat => (
              <button key={cat} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 12px', fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', textAlign: 'center' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ─────────────────────────── */}
      <section style={{ background: '#fff', padding: '56px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Featured Properties</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Live Verified Listings</span>
              </div>
            </div>
            <button onClick={() => navigate('/real-estate/properties')}
              style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All →
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '16/10', background: '#e2e8f0' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6, marginBottom: 10, width: '40%' }} />
                    <div style={{ height: 18, background: '#e2e8f0', borderRadius: 6, marginBottom: 20 }} />
                    <div style={{ height: 36, background: '#f1f5f9', borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 24px', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#64748b' }}>No listings yet — be the first to post!</p>
              <button onClick={() => navigate('/real-estate/post')}
                style={{ marginTop: 20, padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Post Your Property
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────── */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '56px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            ['✓', 'Verified Listings', 'Every listing is manually reviewed before going live on our platform.'],
            ['₹', 'Zero Hidden Brokerage', 'Connect directly with owners and builders. No middlemen, no surprises.'],
            ['📞', 'Direct Owner Connect', 'Get the owner or builder contact with a single click. No gatekeeping.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px 28px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 18 }}>{icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
