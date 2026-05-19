import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getProperty, listSavedProperties, saveProperty, unsaveProperty } from '../services/propertiesApi';
import LoginToUnlockModal from '../components/LoginToUnlockModal';
import OwnerContactModal from '../components/OwnerContactModal';
import { unlockPropertyContact } from '../services/leadApi';

const fmt = (n) => {
  const v = Number(n || 0);
  if (!v) return 'Price on Request';
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
};

const S = { font: 'Inter,sans-serif' };

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
  </svg>
);

function LoadingSkeleton() {
  const box = (h, w = '100%', r = 10) => (
    <div style={{ height: h, width: w, borderRadius: r, background: '#e2e8f0', animation: 'shimmer 1.4s infinite' }} />
  );
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 24px 40px', fontFamily: S.font }}>
      {box(480, '100%', 18)}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, marginTop: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {box(32, '60%')} {box(20, '40%')} {box(120)} {box(200)}
        </div>
        <div>{box(400)}</div>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [mainImg, setMainImg]   = useState(0);
  const [isSaved, setIsSaved]   = useState(false);
  const [saveBusy, setSaveBusy]  = useState(false);

  // Contact Unlock States
  const [unlockedOwner, setUnlockedOwner] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOwnerContactModal, setShowOwnerContactModal] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    getProperty(slug)
      .then(res => { setProperty(res?.data || res); setLoading(false); })
      .catch(e  => { setError(e?.response?.data?.message || e.message); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!property?._id || !isLoggedIn) {
      setIsSaved(false);
      return;
    }

    listSavedProperties()
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setIsSaved(items.some((item) => item._id === property._id));
      })
      .catch(() => setIsSaved(false));
  }, [property?._id]);

  const toggleSave = async () => {
    if (!isLoggedIn) {
      navigate('/real-estate/login');
      return;
    }

    if (!property?._id || saveBusy) return;
    setSaveBusy(true);
    try {
      if (isSaved) {
        await unsaveProperty(property._id);
        setIsSaved(false);
      } else {
        await saveProperty(property._id);
        setIsSaved(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/real-estate/login');
      }
    } finally {
      setSaveBusy(false);
    }
  };

  const handleUnlockClick = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setUnlocking(true);
    setUnlockError('');
    try {
      const res = await unlockPropertyContact(property._id);
      if (res.success && res.unlockedData) {
        setUnlockedOwner(res.unlockedData.owner);
        setShowOwnerContactModal(true);
      } else {
        setUnlockError('Could not unlock owner details.');
      }
    } catch (err) {
      console.error(err);
      setUnlockError(err.response?.data?.message || 'Error unlocking owner details.');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error) return (
    <div style={{ maxWidth: 560, margin: '120px auto', padding: '0 24px', textAlign: 'center', fontFamily: S.font }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#dc2626' }}>
        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16z"/>
        </svg>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 10px' }}>Property not found</h2>
      <p style={{ color: '#64748b', margin: '0 0 28px' }}>{error}</p>
      <Link to="/real-estate/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 700, textDecoration: 'none' }}>
        ← Back to Listings
      </Link>
    </div>
  );

  if (!property) return null;

  const rawMedia = (property.media && property.media.length > 0) ? property.media : (property.images || []);
  const images   = rawMedia.map(i => i.url || i).filter(Boolean);
  const title    = property.title || 'Exclusive Property';
  const location = [property.locality, property.city].filter(Boolean).join(', ') || 'Prime Location';
  const price    = (property.price?.amount ?? property.price) ?? 0;
  const areaSqFt = property.areaSqFt || property.features?.areaSqFt;
  const ppsf     = price && areaSqFt ? Math.round(price / areaSqFt) : null;
  const amenities = property.filters?.amenities || ['Power Backup', 'Gym', 'Swimming Pool', 'Security', 'Club House', 'Parking'];

  const nextImg = (e) => {
    e.stopPropagation();
    setMainImg((prev) => (prev + 1) % images.length);
  };
  const prevImg = (e) => {
    e.stopPropagation();
    setMainImg((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: S.font, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 24px 0' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 12, fontWeight: 600, flexWrap: 'wrap' }} className="re-breadcrumb">
          {[
            { label: 'Home', to: '/real-estate' },
            { label: 'Properties', to: '/real-estate/properties' },
            { label: title, to: null },
          ].map((b, i, arr) => (
            <React.Fragment key={b.label}>
              {b.to
                ? <Link to={b.to} style={{ color: '#64748b', textDecoration: 'none' }} onMouseOver={e => e.currentTarget.style.color = '#2563eb'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>{b.label}</Link>
                : <span style={{ color: '#0f172a', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '40vw' }}>{b.label}</span>
              }
              {i < arr.length - 1 && <span style={{ color: '#cbd5e1' }}>/</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, height: 480, marginBottom: 40 }} className="re-gallery-grid">
          <div style={{ gridRow: '1 / 3', borderRadius: 18, overflow: 'hidden', background: '#e2e8f0', cursor: 'zoom-in', position: 'relative' }}>
            <img
              src={images[mainImg]?.url || images[mainImg] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80'}
              alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImg}
                  style={{
                    position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                    width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .2s', zIndex: 10,
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                >←</button>
                <button 
                  onClick={nextImg}
                  style={{
                    position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                    width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)',
                    color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .2s', zIndex: 10,
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                >→</button>
                <div style={{
                  position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)', color: '#fff', padding: '5px 12px', borderRadius: 20,
                  fontSize: 11, fontWeight: 700, letterSpacing: '.05em'
                }}>
                  {mainImg + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          {images.slice(1, 3).map((img, i) => (
            <div key={i} onClick={() => setMainImg(i + 1)} style={{ borderRadius: 14, overflow: 'hidden', background: '#e2e8f0', cursor: 'pointer' }}>
              <img src={img?.url || img} alt={`View ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
          {images.length < 2 && [0, 1].slice(images.length - 1).map(i => (
            <div key={i} style={{ borderRadius: 14, background: '#e2e8f0' }} />
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 40, alignItems: 'start' }} className="re-detail-grid">

          {/* LEFT: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Title block */}
            <div style={{ background: '#fff', color: '#0f172a', borderRadius: 18, border: '1px solid #e2e8f0', padding: '28px 28px 24px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <span style={{ background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', padding: '3px 12px', borderRadius: 30 }}>Verified</span>
                <span style={{ background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', padding: '3px 12px', borderRadius: 30 }}>{property.filters?.segment || 'Residential'}</span>
                {property.filters?.possession === 'READY_TO_MOVE' && (
                  <span style={{ background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', padding: '3px 12px', borderRadius: 30 }}>Ready to Move</span>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-.03em', lineHeight: 1.2, overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>{title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14, fontWeight: 600, overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                <svg width="15" height="15" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {location}
              </div>
            </div>

            {/* Quick specs */}
            <div style={{ background: '#fff', color: '#0f172a', borderRadius: 18, border: '1px solid #e2e8f0', padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }} className="re-specs-grid">
              {[
                { label: 'Configuration', value: property.filters?.bhk?.replace(/_/g, ' ') || property.features?.bhk || '3 BHK' },
                { label: 'Super Area', value: `${property.areaSqFt || property.features?.areaSqFt || '1500'} sqft` },
                { label: 'Possession', value: property.possessionDate || 'Dec 2026' },
                { label: 'Furnishing', value: property.filters?.furnishing?.replace(/_/g, ' ') || 'Semi-Furnished' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8', margin: '0 0 6px' }}>{s.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ background: '#fff', color: '#0f172a', borderRadius: 18, border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 4, height: 22, background: '#2563eb', borderRadius: 2 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Overview</h3>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.75, fontSize: 15, margin: 0, overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>
                {property.description || 'This premium property offers modern living in a prime locality with world-class amenities and excellent connectivity to major business hubs. The project is developed by a reputed builder with a proven track record of timely delivery.'}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ background: '#fff', color: '#0f172a', borderRadius: 18, border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 4, height: 22, background: '#2563eb', borderRadius: 2 }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Amenities</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="re-amenities-grid">
                {amenities.map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, background: '#eff6ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0,
                    }}><CheckIcon /></div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{a.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Pricing & Enquiry */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 96 }}>

            {/* Price card */}
            <div style={{
              background: '#0f172a', borderRadius: 20,
              padding: '28px 24px', color: '#fff',
              borderBottom: '4px solid #2563eb',
              boxShadow: '0 20px 50px rgba(0,0,0,.15)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b', margin: '0 0 8px' }}>Price</p>
              <h2 style={{ fontSize: 38, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-.03em' }}>{fmt(price)}</h2>
              {ppsf && <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px', fontWeight: 500 }}>₹{ppsf.toLocaleString()}/sqft</p>}

              <button
                type="button"
                onClick={toggleSave}
                disabled={saveBusy}
                style={{
                  width: '100%',
                  marginBottom: 20,
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,.12)',
                  background: isSaved ? 'rgba(248,113,113,.16)' : 'rgba(255,255,255,.07)',
                  color: isSaved ? '#fecaca' : '#fff',
                  fontFamily: S.font,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: saveBusy ? 'wait' : 'pointer',
                }}
              >
                {saveBusy ? 'Updating…' : (isSaved ? 'Saved Property' : 'Save Property')}
              </button>

              {/* Secure Unlock Contact flow in PropertyDetail page */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                {unlockedOwner ? (
                  <button 
                    onClick={() => setShowOwnerContactModal(true)}
                    style={{
                      background: '#16a34a', color: '#fff', border: 'none',
                      padding: '14px', borderRadius: 12, fontFamily: S.font,
                      fontSize: 13.5, fontWeight: 800, cursor: 'pointer',
                      transition: 'background .15s', textTransform: 'uppercase', letterSpacing: '.04em',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#15803d'}
                    onMouseOut={e => e.currentTarget.style.background = '#16a34a'}
                  >
                    <span>📞</span>
                    Contact Owner
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>
                      <span>🛡️</span>
                      <span>Owner contact verified and active</span>
                    </div>

                    {unlockError && <p style={{ color: '#f87171', fontSize: 12, margin: '0 0 6px', fontWeight: 600 }}>⚠️ {unlockError}</p>}

                    <button 
                      onClick={handleUnlockClick}
                      disabled={unlocking}
                      style={{
                        background: unlocking ? '#60a5fa' : '#2563eb', color: '#fff', border: 'none',
                        padding: '14px', borderRadius: 12, fontFamily: S.font,
                        fontSize: 13.5, fontWeight: 800, cursor: unlocking ? 'wait' : 'pointer',
                        transition: 'background .15s', textTransform: 'uppercase', letterSpacing: '.04em',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%'
                      }}
                      onMouseOver={e => { if (!unlocking) e.currentTarget.style.background = '#1d4ed8'; }}
                      onMouseOut={e => { if (!unlocking) e.currentTarget.style.background = '#2563eb'; }}
                    >
                      <span>🔑</span>
                      {unlocking ? 'Verifying Identity...' : (isLoggedIn ? 'Reveal Contact Details' : 'Sign in to unlock contact')}
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Safety tips */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 20px' }}>
              <h4 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#0f172a', margin: '0 0 14px' }}>🔒 Safety Tips</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Never pay booking amount without site visit', 'Verify RERA registration number', 'Check for legal title of the property'].map(tip => (
                  <li key={tip} style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 500, color: '#64748b', lineHeight: 1.5 }}>
                    <span style={{ color: '#2563eb', fontWeight: 800, flexShrink: 0 }}>!</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Auth Modal overlay */}
      <LoginToUnlockModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        propertyId={property._id}
        onSuccess={(owner) => { setUnlockedOwner(owner); setShowOwnerContactModal(true); }}
      />

      {/* Owner Contact Modal Popup */}
      <OwnerContactModal 
        isOpen={showOwnerContactModal}
        onClose={() => setShowOwnerContactModal(false)}
        owner={unlockedOwner}
        propertyName={title}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer{0%,100%{opacity:.8}50%{opacity:.4}}
        @keyframes re-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media(max-width:960px){
          .re-detail-grid{grid-template-columns:1fr !important}
          .re-detail-grid aside { position: static !important; }
        }
        @media(max-width:800px){
          .re-gallery-grid{grid-template-columns:1fr !important; grid-template-rows:auto !important; height:300px !important}
          .re-gallery-grid>:not(:first-child){display:none}
          div[style*="maxWidth: 1240"] { padding: 80px 16px 0 !important; }
        }
        @media(max-width:640px){
          .re-specs-grid{grid-template-columns:repeat(2,1fr) !important}
          .re-amenities-grid{grid-template-columns:repeat(2,1fr) !important}
        }
        @media(max-width:480px){
          .re-amenities-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </div>
  );
}

// Sidebar Button styles
const quickCallStyle = {
  background: '#2563eb', color: '#fff', textDecoration: 'none',
  textAlign: 'center', padding: '10px 12px', borderRadius: 10,
  fontSize: 12, fontWeight: 700, display: 'block', transition: 'background .15s'
};

const quickWAStyle = {
  background: '#16a34a', color: '#fff', textDecoration: 'none',
  textAlign: 'center', padding: '10px 12px', borderRadius: 10,
  fontSize: 12, fontWeight: 700, display: 'block', transition: 'background .15s'
};
