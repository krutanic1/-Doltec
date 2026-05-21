import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const fmt = (n) => {
  const v = Number(n || 0);
  if (!v) return 'Price on Request';
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
};

export default function PropertyCard({ property: p, onCompare, isComparing, isSaved, onToggleSave }) {
  const [localSaved, setLocalSaved] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (!p) return null;

  const title    = p.title    || 'Exclusive Property';
  const builder  = p.builder  || 'Premium Developer';
  const locality = p.locality || p.city || 'Prime Location';
  const price    = (p.price?.amount ?? p.price) ?? 0;
  const ppsf     = p.areaSqFt && price ? Math.round(price / p.areaSqFt) : 0;
  const slug     = p.slug || p._id;
  const rawMedia = (p.media && p.media.length > 0) ? p.media : (p.images || []);
  const images   = rawMedia.map(i => i.url || i).filter(Boolean);
  const img      = images[imgIdx] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';
  const bhk      = p.filters?.bhk?.replace(/_/g, ' ') || '3 BHK';
  const area     = p.areaSqFt ? `${p.areaSqFt.toLocaleString()} sqft` : '—';
  const poss     = p.possessionDate || 'Dec 2026';
  const saved    = typeof isSaved === 'boolean' ? isSaved : localSaved;

  const toggleSaved = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (onToggleSave) { onToggleSave(p); return; }
    setLocalSaved(c => !c);
  };

  return (
    <article style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow .28s cubic-bezier(.4,0,.2,1), transform .28s cubic-bezier(.4,0,.2,1)',
      fontFamily: 'Inter,sans-serif',
      position: 'relative',
      boxShadow: '0 2px 12px rgba(0,0,0,.05)',
    }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(5,13,26,.12)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,.25)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.05)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#f3f4f6' }}>
        <Link to={`/real-estate/properties/${slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.4,0,.2,1)' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Gradient overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,13,26,.55) 0%, transparent 50%)', pointerEvents:'none' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(5,13,26,.75)', backdropFilter: 'blur(8px)',
            padding: '4px 10px', borderRadius: 30,
            fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '.06em', textTransform: 'uppercase',
            border: '1px solid rgba(255,255,255,.12)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            Verified
          </span>
          {p.filters?.possession === 'READY_TO_MOVE' && (
            <span style={{
              background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff',
              padding: '4px 10px', borderRadius: 30, fontSize: 10, fontWeight: 800,
              letterSpacing: '.06em', textTransform: 'uppercase',
            }}>Ready to Move</span>
          )}
        </div>

        {/* Save button */}
        <button type="button" onClick={toggleSaved} style={{
          position: 'absolute', top: 12, right: 12,
          width: 36, height: 36, borderRadius: '50%',
          background: saved ? 'rgba(239,68,68,.9)' : 'rgba(5,13,26,.6)',
          backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.15)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,.2)',
          transition: 'all .2s',
        }}>
          <svg width="15" height="15" fill={saved ? '#fff' : 'none'} stroke="#fff" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        {/* Price overlay on image */}
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-.02em', textShadow: '0 2px 8px rgba(0,0,0,.3)' }}>{fmt(price)}</p>
          {ppsf > 0 && <p style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', margin: '2px 0 0', fontWeight: 600 }}>@₹{ppsf.toLocaleString()}/sqft</p>}
        </div>

        {/* Image strip nav */}
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: 3, padding: '0 12px 8px' }}>
            {images.slice(0, 5).map((_, i) => (
              <div key={i} onMouseOver={() => setImgIdx(i)} style={{
                flex: 1, height: 2.5, borderRadius: 2,
                background: i === imgIdx ? '#f59e0b' : 'rgba(255,255,255,.3)',
                cursor: 'pointer', transition: 'background .15s',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Builder */}
        <span style={{
          fontSize: 10, fontWeight: 800, color: '#d97706',
          textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6, display: 'block',
        }}>{builder}</span>

        {/* Title & Location */}
        <Link to={`/real-estate/properties/${slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: 15, fontWeight: 800, color: '#0a1628',
            margin: '0 0 5px', letterSpacing: '-.02em', lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
            transition: 'color .15s',
          }}
            onMouseOver={e => e.currentTarget.style.color = '#d97706'}
            onMouseOut={e => e.currentTarget.style.color = '#0a1628'}
          >{title}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 12, fontWeight: 500, marginBottom: 14 }}>
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {locality}{p.city && locality !== p.city ? `, ${p.city}` : ''}
        </div>

        {/* Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 14 }}>
          {[{ l: 'Config', v: bhk }, { l: 'Area', v: area }, { l: 'Possession', v: poss }].map(s => (
            <div key={s.l} style={{ background: '#f9fafb', borderRadius: 10, padding: '8px 10px', border: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 3px' }}>{s.l}</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#0a1628', margin: 0 }}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* RERA + Compare */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 1px' }}>RERA ID</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#4b5563', margin: 0 }}>{p.reraId || 'P-GRG-1234-5678'}</p>
          </div>
          {onCompare && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <div onClick={() => onCompare(p)} style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: 'pointer',
                border: `2px solid ${isComparing ? '#f59e0b' : '#d1d5db'}`,
                background: isComparing ? '#f59e0b' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                {isComparing && <svg width="10" height="10" fill="none" stroke={isComparing ? '#050d1a' : 'white'} viewBox="0 0 24 24"><path strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em' }}>Compare</span>
            </label>
          )}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          <Link to={`/real-estate/properties/${slug}`} style={{
            background: '#050d1a', color: '#f59e0b',
            border: 'none', padding: '12px', borderRadius: 12,
            fontWeight: 800, fontSize: 13, cursor: 'pointer',
            fontFamily: 'Inter,sans-serif', textDecoration: 'none',
            transition: 'all .2s', textTransform: 'uppercase', letterSpacing: '.05em',
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box', boxShadow: '0 4px 16px rgba(5,13,26,.15)',
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)'; e.currentTarget.style.color = '#050d1a'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,.3)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#050d1a'; e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(5,13,26,.15)'; }}
          >View Details →</Link>
        </div>
      </div>
    </article>
  );
}
