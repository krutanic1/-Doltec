import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProperty } from '../services/propertiesApi';

const S = { font: 'Inter,sans-serif' };

const fmt = (value) => {
  const amount = Number(value?.amount ?? value ?? 0);
  if (!amount) return 'Price on Request';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
};

const compareFields = [
  { label: 'Price', get: (property) => fmt(property.price) },
  { label: 'City', get: (property) => property.city || '—' },
  { label: 'Locality', get: (property) => property.locality || '—' },
  { label: 'Configuration', get: (property) => property.filters?.bhk?.replace(/_/g, ' ') || '—' },
  { label: 'Area', get: (property) => `${property.areaSqFt || '—'} sqft` },
  { label: 'Possession', get: (property) => property.filters?.possession?.replace(/_/g, ' ') || property.possessionDate || '—' },
  { label: 'Furnishing', get: (property) => property.filters?.furnishing?.replace(/_/g, ' ') || '—' },
  { label: 'Amenities', get: (property) => (property.filters?.amenities || []).slice(0, 4).map((item) => item.replace(/_/g, ' ')).join(', ') || '—' },
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

    return () => {
      mounted = false;
    };
  }, [slugs]);

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: isWorkspace ? '0px 0px 40px' : '100px 24px 80px', fontFamily: S.font }}>
      {!isWorkspace && (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: '#2563eb', margin: '0 0 8px' }}>Compare</p>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#0f172a', margin: 0 }}>Side-by-side property comparison</h1>
            <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, margin: '8px 0 0' }}>Review the main tradeoffs before you shortlist or contact owners.</p>
          </div>
          <Link to="/real-estate/properties" style={{ textDecoration: 'none', background: '#fff', border: '1px solid #e2e8f0', color: '#334155', padding: '11px 18px', borderRadius: 12, fontWeight: 700 }}>
            Back to Listings
          </Link>
        </div>
      )}

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 12, padding: '12px 16px', marginBottom: 18, fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 24, minHeight: 320 }}>
          Loading comparison…
        </div>
      ) : items.length > 0 ? (
        <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '18px 20px', borderBottom: '1px solid #e2e8f0', width: 180 }}>Feature</th>
                {items.map((property) => (
                  <th key={property._id} style={{ textAlign: 'left', padding: '18px 20px', borderBottom: '1px solid #e2e8f0', minWidth: 260 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#f1f5f9' }}>
                        <img
                          src={property.media?.[0]?.url || property.images?.[0]?.url || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                          alt={property.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{property.title || 'Untitled Property'}</h2>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{property.locality || 'Prime Location'}, {property.city || 'India'}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFields.map((field) => (
                <tr key={field.label}>
                  <td style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 800, color: '#0f172a' }}>{field.label}</td>
                  {items.map((property) => (
                    <td key={property._id + field.label} style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', color: '#334155', verticalAlign: 'top' }}>
                      {field.get(property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 20, padding: '48px 24px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Nothing to compare</h2>
          <p style={{ margin: 0, color: '#64748b' }}>Go back to listings and pick two or three properties from the compare checkboxes.</p>
        </div>
      )}
    </section>
  );
}