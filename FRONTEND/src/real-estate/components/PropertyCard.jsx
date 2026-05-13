/* ─────────────────────────────────────────────────────
   src/real-estate/components/PropertyCard.jsx
───────────────────────────────────────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';

const WA = '919324504318';

function fmt(n) {
  const v = Number(n || 0);
  if (!v) return 'Price on Request';
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

function getImg(p) {
  return p?.images?.[0]?.url
    || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
}

export default function PropertyCard({ property: p }) {
  if (!p) return null;
  const title    = p.title || 'Exclusive Property';
  const locality = p.locality || p.city || 'Prime Location';
  const price    = p.price?.amount ?? 0;
  const slug     = p.slug || p._id;

  return (
    <article
      style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.25s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
        <img src={getImg(p)} alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <span style={{ background: 'rgba(255,255,255,0.92)', color: '#0f172a', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
            {p.category || 'Residential'}
          </span>
          <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
            {p.type || 'Buy'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          📍 {locality}
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </h3>

        {/* Facts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '12px 0', marginBottom: 16, gap: 8 }}>
          {[['Beds', p.bhk || '—'], ['Baths', p.bathrooms || '—'], ['Area', p.areaSqFt ? `${p.areaSqFt}ft²` : '—']].map(([l, v]) => (
            <div key={l}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>{l}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Price + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{fmt(price)}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={`https://wa.me/${WA}?text=Hi, I'm interested in ${encodeURIComponent(title)}`}
              target="_blank" rel="noreferrer"
              style={{ width: 38, height: 38, border: '1px solid #e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>
              💬
            </a>
            <Link to={`/real-estate/properties/${slug}`}
              style={{ height: 38, padding: '0 18px', background: '#0f172a', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              View →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
