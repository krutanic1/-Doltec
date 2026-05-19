import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { listSavedProperties, unsaveProperty } from '../services/propertiesApi';

export default function Saved() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/real-estate/login');
      return;
    }

    setLoading(true);
    listSavedProperties()
      .then((res) => {
        const properties = Array.isArray(res) ? res : res?.data || [];
        setItems(properties);
        setError('');
      })
      .catch((err) => setError(err?.response?.data?.message || err.message || 'Failed to load saved properties'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleToggleSave = async (property) => {
    try {
      await unsaveProperty(property._id);
      setItems((current) => current.filter((item) => item._id !== property._id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to remove saved property');
    }
  };

  return (
    <section style={{ maxWidth: 1240, margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.15em', color: '#2563eb', margin: '0 0 8px' }}>Saved</p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#0f172a', margin: 0 }}>Your saved properties</h1>
        <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, margin: '8px 0 0' }}>Review and reopen the properties you want to revisit.</p>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 12, padding: '14px 18px', marginBottom: 18, color: '#991b1b', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 360, borderRadius: 18, background: '#e2e8f0', animation: 'pulse 1.4s ease-in-out infinite' }} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }} className="re-saved-grid">
          {items.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isSaved
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 20, padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>No saved properties yet</h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 22px' }}>Save listings from search results or property pages to keep them here.</p>
          <button onClick={() => navigate('/real-estate/properties')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
            Browse Properties
          </button>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}} @media(max-width:900px){.re-saved-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}
