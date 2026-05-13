/* ─────────────────────────────────────────────────────
   src/real-estate/pages/PropertyDetail.jsx
───────────────────────────────────────────────────── */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../services/propertiesApi';

const WA = '919324504318';

function fmt(n) {
  const v = Number(n || 0);
  if (!v) return 'Price on Request';
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [mainImg,  setMainImg]  = useState(0);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  useEffect(() => {
    setLoading(true);
    getProperty(slug)
      .then(res => { setProperty(res?.data || res); setLoading(false); })
      .catch(e  => { setError(e?.response?.data?.message || e.message); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 32 }}>
        <div style={{ aspectRatio: '16/9', background: '#e2e8f0', borderRadius: 16 }} />
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: 8 }}>
          {[1,2,3].map(i => <div key={i} style={{ background: '#e2e8f0', borderRadius: 10 }} />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '40px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, textAlign: 'center' }}>
      <p style={{ color: '#991b1b', fontWeight: 600 }}>{error}</p>
      <Link to="/real-estate/properties" style={{ display: 'inline-block', marginTop: 16, color: '#2563eb', fontWeight: 700 }}>← Back to Listings</Link>
    </div>
  );

  if (!property) return null;

  const images   = property.images || [];
  const title    = property.title  || 'Property';
  const location = [property.locality, property.city, property.state].filter(Boolean).join(', ') || 'India';
  const price    = property.price?.amount ?? 0;
  const pricePerSqft = price && property.areaSqFt ? Math.round(price / property.areaSqFt) : null;

  const handleEnquiry = (e) => {
    e.preventDefault();
    const wa = `https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I'm interested in: ${title}\nLocation: ${location}\nPrice: ${fmt(price)}\n\nName: ${form.name}\nPhone: ${form.phone}\n${form.message ? `Message: ${form.message}` : ''}`)}`;
    window.open(wa, '_blank');
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#94a3b8' }}>
          <Link to="/real-estate" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/real-estate/properties" style={{ color: '#2563eb', textDecoration: 'none' }}>Listings</Link>
          <span>›</span>
          <span style={{ color: '#64748b', fontWeight: 500 }}>{title}</span>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12, marginBottom: 40, borderRadius: 20, overflow: 'hidden' }}>
            <img src={images[mainImg]?.url || images[mainImg]} alt={title}
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', cursor: 'pointer' }} />
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 12 }}>
              {images.slice(1, 4).map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={img?.url || img} alt={`View ${i + 2}`}
                    onClick={() => setMainImg(i + 1)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }} />
                  {i === 2 && images.length > 4 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                      +{images.length - 4} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'flex-start' }}>

          {/* Main Content */}
          <div>
            {/* Badges + Title */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {property.category && <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase' }}>{property.category}</span>}
              {property.type     && <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase' }}>{property.type}</span>}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.5px' }}>{title}</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>📍 {location}</p>

            {/* Key Facts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 24px', marginBottom: 32 }}>
              {[
                ['BHK', property.bhk ? `${property.bhk} BHK` : '—'],
                ['Baths', property.bathrooms || '—'],
                ['Area', property.areaSqFt ? `${property.areaSqFt} ft²` : '—'],
                ['Furnishing', property.furnishing || '—'],
              ].map(([l, v]) => (
                <div key={l}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{l}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#334155', textTransform: 'capitalize' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px 28px', marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Overview</h2>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{property.description}</p>
              </section>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px 28px', marginBottom: 24 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Amenities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {property.amenities.map(a => (
                    <span key={a} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#334155' }}>
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '28px 24px', position: 'sticky', top: 80 }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{fmt(price)}</p>
            {pricePerSqft && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>₹{pricePerSqft.toLocaleString('en-IN')} / sq.ft</p>}

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Listed by</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{property.posterName || 'Doltec Estates'}</p>
              <span style={{ display: 'inline-block', marginTop: 4, background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>VERIFIED</span>
            </div>

            <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi, interested in: ${title}`)}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'block', width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, textAlign: 'center', textDecoration: 'none', marginBottom: 10 }}>
              💬 WhatsApp Owner
            </a>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, marginTop: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Schedule a Visit</p>
              <form onSubmit={handleEnquiry}>
                {['name', 'phone'].map(field => (
                  <input key={field} required type={field === 'phone' ? 'tel' : 'text'}
                    placeholder={field === 'name' ? 'Your Name' : 'Phone Number'}
                    value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ display: 'block', width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 10, outline: 'none', boxSizing: 'border-box' }} />
                ))}
                <textarea placeholder="Message (optional)" value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={3} style={{ display: 'block', width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 12, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Send Enquiry
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
