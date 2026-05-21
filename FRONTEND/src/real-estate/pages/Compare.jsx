import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProperty } from '../services/propertiesApi';

const fmt = (value) => {
  const amount = Number(value?.amount ?? value ?? 0);
  if (!amount) return 'Price on Request';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

const compareFields = [
  { label: 'Price', get: (property) => <strong style={{ color: '#0f1629', fontSize: 16, fontWeight: 900 }}>{fmt(property.price)}</strong> },
  { label: 'City', get: (property) => property.city || '—' },
  { label: 'Locality', get: (property) => property.locality || '—' },
  { label: 'Configuration', get: (property) => property.filters?.bhk?.replace(/_/g, ' ') || '—' },
  { label: 'Area', get: (property) => `${property.areaSqFt || '—'} sqft` },
  { label: 'Possession', get: (property) => property.filters?.possession?.replace(/_/g, ' ') || property.possessionDate || '—' },
  { label: 'Furnishing', get: (property) => property.filters?.furnishing?.replace(/_/g, ' ') || '—' },
  { label: 'Amenities', get: (property) => (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(property.filters?.amenities || []).slice(0, 4).map(item => (
          <span key={item} style={{ background: '#f8f9fc', border: '1px solid rgba(226,230,240,0.8)', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
            {item.replace(/_/g, ' ')}
          </span>
        ))}
        {!(property.filters?.amenities?.length) && '—'}
      </div>
    ) 
  },
  { label: 'Posted By', get: (property) => property.filters?.postedBy || '—' },
  { label: 'RERA ID', get: (property) => property.reraId || '—' },
];

export default function Compare() {
  const [searchParams] = useSearchParams();
  const slugs = useMemo(() => (searchParams.get('slugs') || '').split(',').map((item) => item.trim()).filter(Boolean), [searchParams]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isWorkspace = window.location.pathname.includes('/workspace');

  useEffect(() => {
    let mounted = true;
    if (slugs.length < 2) {
      setLoading(false);
      setError('Select at least two properties to compare.');
      return undefined;
    }

    setLoading(true);
    setError('');

    Promise.allSettled(slugs.map((slug) => getProperty(slug)))
      .then((results) => {
        if (!mounted) return;
        const nextItems = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value?.data || result.value)
          .filter(Boolean);
        setItems(nextItems);
        if (nextItems.length < 2) {
          setError('Some selected properties could not be loaded.');
        }
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'Failed to load compare data.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [slugs]);

  return (
    <section className={isWorkspace ? "re-fade-in" : "re-page"}>
      <div className={isWorkspace ? "" : "re-container"} style={{ paddingTop: isWorkspace ? 0 : 60, paddingBottom: 60 }}>
        
        {!isWorkspace && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 40 }}>
            <div>
              <div className="re-eyebrow">Analysis</div>
              <h1 className="re-page-title">Side-by-side comparison</h1>
              <p className="re-page-subtitle">Review the main tradeoffs before you shortlist or contact owners.</p>
            </div>
            <Link to="/real-estate/properties" className="re-btn re-btn-outline" style={{ padding: '10px 20px' }}>
              ← Back to Listings
            </Link>
          </div>
        )}

        {isWorkspace && (
          <div style={{ marginBottom: 24 }}>
            <div className="re-eyebrow">Analysis</div>
            <h1 className="re-page-title">Side-by-side comparison</h1>
            <p className="re-page-subtitle">Review the main tradeoffs before you shortlist or contact owners.</p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(240,62,94,0.08)', border: '1px solid rgba(240,62,94,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, color: '#f03e5e', fontSize: 14, fontWeight: 700 }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="re-card" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <div className="re-spinner re-spinner-dark" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#9fa6b8', fontSize: 14, fontWeight: 600 }}>Loading comparison matrix…</p>
          </div>
        ) : items.length > 0 ? (
          <div className="re-panel" style={{ overflowX: 'auto' }}>
            <table className="re-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={{ width: 180, paddingLeft: 32, background: '#fff' }}>Compare Features</th>
                  {items.map((property) => (
                    <th key={property._id} style={{ minWidth: 280, background: '#fff', verticalAlign: 'top', paddingTop: 32, paddingBottom: 24 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 16, overflow: 'hidden', background: '#f1f3f9', position: 'relative' }}>
                          <img
                            src={property.media?.[0]?.url || property.images?.[0]?.url || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                            alt={property.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: 100, fontSize: 10, fontWeight: 800, color: '#0f1629' }}>
                            {property.status}
                          </div>
                        </div>
                        <div>
                          <h2 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, color: '#0f1629', lineHeight: 1.3 }}>{property.title || 'Untitled Property'}</h2>
                          <p style={{ margin: 0, color: '#6b7494', fontSize: 13, fontWeight: 500 }}>📍 {property.locality || 'Prime Location'}, {property.city || 'India'}</p>
                        </div>
                        <Link to={`/real-estate/properties/${property.slug}`} className="re-btn re-btn-outline re-btn-sm re-btn-full" style={{ marginTop: 8 }}>
                          View Details
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareFields.map((field, idx) => (
                  <tr key={field.label} style={{ background: idx % 2 === 0 ? '#f8f9fc' : '#fff' }}>
                    <td style={{ padding: '20px 20px 20px 32px', fontWeight: 800, color: '#4b5575', fontSize: 13 }}>{field.label}</td>
                    {items.map((property) => (
                      <td key={property._id + field.label} style={{ padding: '20px', color: '#0f1629', fontSize: 14, fontWeight: 500, verticalAlign: 'middle' }}>
                        {field.get(property)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="re-empty" style={{ background: '#fff', border: '1px dashed rgba(226,230,240,0.8)', borderRadius: 24, padding: '80px 24px' }}>
            <div className="re-empty-icon" style={{ background: 'rgba(250,162,25,0.08)', color: '#faa219', fontSize: 32, width: 80, height: 80 }}>⚖️</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f1629', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Nothing to compare</h2>
            <p style={{ color: '#6b7494', fontSize: 15, margin: '0 0 32px', fontWeight: 500 }}>Go back to listings and pick two or three properties from the compare checkboxes.</p>
            <Link to="/real-estate/properties" className="re-btn re-btn-primary re-btn-xl">
              Find Properties to Compare
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}