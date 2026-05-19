import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const fmt = (n) => {
  const v = Number(n || 0);
  if (!v) return 'Price on Request';
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
};

const HeartIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

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
  const area     = p.areaSqFt ? `${p.areaSqFt} sqft` : '—';
  const poss     = p.possessionDate || 'Dec 2026';
  const saved    = typeof isSaved === 'boolean' ? isSaved : localSaved;

  const isLoggedIn = !!localStorage.getItem('token');

  const toggleSaved = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (onToggleSave) {
      onToggleSave(p);
      return;
    }
    setLocalSaved((current) => !current);
  };

  const handleUnlockClick = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setUnlocking(true);
    setUnlockError('');
    try {
      const res = await unlockPropertyContact(p._id);
      if (res.success && res.unlockedData) {
        setUnlockedOwner(res.unlockedData.owner);
        setShowOwnerContactModal(true);
      } else {
        setUnlockError('Could not unlock details.');
      }
    } catch (err) {
      console.error(err);
      setUnlockError(err.response?.data?.message || 'Error unlocking details.');
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <article style={{
      background: '#fff',
      borderRadius: 18,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'box-shadow .2s, transform .2s',
      fontFamily: 'Inter,sans-serif',
      position: 'relative'
    }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#f1f5f9' }}>
        <Link to={`/real-estate/properties/${slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>

        {/* Top badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)',
            padding: '3px 10px', borderRadius: 30,
            fontSize: 10, fontWeight: 800, color: '#0f172a', letterSpacing: '.05em', textTransform: 'uppercase',
            boxShadow: '0 2px 10px rgba(0,0,0,.12)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
            Verified
          </span>
          {p.filters?.possession === 'READY_TO_MOVE' && (
            <span style={{
              background: '#10b981', color: '#fff',
              padding: '3px 10px', borderRadius: 30,
              fontSize: 10, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase',
            }}>Ready to Move</span>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={toggleSaved}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: saved ? '#ef4444' : '#64748b', boxShadow: '0 2px 8px rgba(0,0,0,.12)',
            transition: 'all .15s',
          }}
        >
          <HeartIcon />
        </button>

        {/* Image strip */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '20px 12px 10px',
            background: 'linear-gradient(transparent, rgba(0,0,0,.4))',
            display: 'flex', gap: 4,
          }}>
            {images.slice(0, 5).map((_, i) => (
              <div key={i} onMouseOver={() => setImgIdx(i)} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i === imgIdx ? '#fff' : 'rgba(255,255,255,.35)',
                cursor: 'pointer', transition: 'background .15s',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Builder row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.06em' }}>{builder}</span>
        </div>

        {/* Title & Location */}
        <Link to={`/real-estate/properties/${slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: 15, fontWeight: 800, color: '#0f172a',
            margin: '0 0 4px', letterSpacing: '-.02em', lineHeight: 1.3,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
            transition: 'color .15s',
          }}
            onMouseOver={e => e.currentTarget.style.color = '#2563eb'}
            onMouseOut={e => e.currentTarget.style.color = '#0f172a'}
          >{title}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12, fontWeight: 500, marginBottom: 14 }}>
          <LocationIcon /> {locality}, {p.city}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <p style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-.03em', margin: 0 }}>{fmt(price)}</p>
            {ppsf > 0 && <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>@₹{ppsf.toLocaleString()}/sqft</p>}
          </div>
        </div>

        {/* Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
          {[{ l: 'Config', v: bhk }, { l: 'Area', v: area }, { l: 'Possession', v: poss }].map(s => (
            <div key={s.l} style={{ background: '#f8fafc', borderRadius: 9, padding: '8px 10px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 3px' }}>{s.l}</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', margin: 0 }}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Footer: RERA + Compare */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 1px' }}>RERA ID</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', margin: 0 }}>{p.reraId || 'P-GRG-1234-5678'}</p>
          </div>
          {onCompare && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <div
                onClick={() => onCompare(p)}
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: 'pointer',
                  border: `2px solid ${isComparing ? '#2563eb' : '#cbd5e1'}`,
                  background: isComparing ? '#2563eb' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}
              >
                {isComparing && <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em' }}>Compare</span>
            </label>
          )}
        </div>

        {/* CTAs / View Details button */}
        <div style={{ marginTop: 'auto' }}>
          <Link 
            to={`/real-estate/properties/${slug}`}
            style={{
              background: '#2563eb', color: '#fff', border: 'none',
              padding: '12px', borderRadius: 10, fontWeight: 800, fontSize: 13,
              cursor: 'pointer', fontFamily: 'Inter,sans-serif', textDecoration: 'none',
              transition: 'background .15s', textTransform: 'uppercase', letterSpacing: '.02em',
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
          >
            View Details
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes re-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
}
