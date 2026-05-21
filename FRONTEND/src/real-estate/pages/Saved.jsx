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
    <section className="re-page">
      <div className="re-container" style={{ paddingTop: 60 }}>
        
        {/* Header */}
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="re-eyebrow">Favorites</div>
            <h1 className="re-page-title">Saved Properties</h1>
            <p className="re-page-subtitle" style={{ maxWidth: 600 }}>Review and compare the properties you have shortlisted.</p>
          </div>
          <button 
            className="re-btn re-btn-outline" 
            onClick={() => navigate('/real-estate/properties')}
            style={{ padding: '10px 20px' }}
          >
            ← Browse More
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(240,62,94,0.08)', border: '1px solid rgba(240,62,94,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, color: '#f03e5e', fontSize: 14, fontWeight: 700 }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="re-grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="re-skeleton" style={{ height: 380, borderRadius: 20 }} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="re-grid-3">
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
          <div className="re-empty" style={{ background: '#fff', border: '1px dashed rgba(226,230,240,0.8)', borderRadius: 24, padding: '80px 24px' }}>
            <div className="re-empty-icon" style={{ background: 'rgba(59,91,219,0.08)', color: '#3b5bdb', fontSize: 32, width: 80, height: 80 }}>❤️</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f1629', margin: '0 0 12px', letterSpacing: '-0.02em' }}>No saved properties yet</h2>
            <p style={{ color: '#6b7494', fontSize: 15, margin: '0 0 32px', fontWeight: 500 }}>Shortlist properties you like while browsing to easily access them later.</p>
            <button onClick={() => navigate('/real-estate/properties')} className="re-btn re-btn-primary re-btn-xl">
              Explore Properties
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
