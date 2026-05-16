import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../services/api/axios';
import PropertyStatusBadge from '../components/PropertyStatusBadge';

const S = { font: 'Inter,sans-serif' };

const PlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/real-estate');
  };

  useEffect(() => {
    setLoading(true);
    api.get('/properties/my-properties')
      .then(res => { setItems(res.data.data || res.data || []); setLoading(false); })
      .catch(err => { 
        const errMsg = err.response?.data?.message || err.response?.data?.msg || err.message;
        if (err.response?.status === 401 || errMsg === 'No token, authorization denied') {
          logout();
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/real-estate/login');
        } else {
          setError(errMsg);
          setLoading(false);
        }
      });
  }, [navigate, logout]);

  const totalViews = items.reduce((acc, item) => acc + (item.views || 0), 0);
  const totalLeads = items.reduce((acc, item) => acc + (item.leads?.length || item.leadsCount || 0), 0);

  const STATS = [
    { label: 'Active Listings',  value: items.filter(i => i.status === 'APPROVED').length, color: '#2563eb', bg: '#eff6ff', border: '#dbeafe' },
    { label: 'Pending Review',   value: items.filter(i => i.status === 'PENDING').length,   color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { label: 'Total Views',      value: totalViews,  color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    { label: 'Leads Generated',  value: totalLeads,    color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: S.font, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 24px 0' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-.03em' }}>
              Hello, {user?.name?.split(' ')[0] || 'Member'} 👋
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, margin: 0 }}>
              Manage your properties and track your performance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleLogout} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#fff', color: '#ef4444', border: '1px solid #fee2e2',
              padding: '11px 18px', borderRadius: 12, cursor: 'pointer',
              fontWeight: 700, fontSize: 14, transition: 'all .15s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fee2e2'; }}
            >
              <LogoutIcon /> Logout
            </button>
            <Link to="/real-estate/post-property" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#2563eb', color: '#fff', textDecoration: 'none',
              padding: '11px 22px', borderRadius: 12,
              fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(37,99,235,.25)',
              transition: 'all .15s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
            >
              <PlusIcon /> Post New Property
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 40 }} className="re-stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 16, border: `1px solid ${s.border}`,
              padding: '20px 24px', transition: 'box-shadow .2s',
            }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.07)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8', margin: '0 0 10px' }}>{s.label}</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: s.color, margin: 0, letterSpacing: '-.03em' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Listings Panel */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-.01em' }}>Your Listings</h2>
            <button style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
          </div>

          {loading ? (
            <div style={{ padding: '16px 16px 8px' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 80, background: '#f8fafc', borderRadius: 12, marginBottom: 8, animation: 'shimmer 1.4s infinite' }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: 14 }}>{error}</p>
            </div>
          ) : items.length > 0 ? (
            <div style={{ padding: '8px 12px 12px' }}>
              {items.map(property => (
                <div key={property._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
                  padding: '14px 16px', borderRadius: 14, transition: 'background .15s',
                }}
                  onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                      <img
                        src={((property.media && property.media.length > 0) ? property.media : (property.images || []))[0]?.url || 
                             ((property.media && property.media.length > 0) ? property.media : (property.images || []))[0] || 
                             'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{property.title}</h3>
                        <PropertyStatusBadge status={property.status} />
                      </div>
                      <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, margin: 0 }}>
                        {property.locality || 'Prime Location'} · {property.city}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right', paddingRight: 16, borderRight: '1px solid #f1f5f9' }} className="re-desktop-only">
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#94a3b8', margin: '0 0 2px' }}>Leads</p>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>{property.leads?.length || property.leadsCount || 0} Contacts</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/real-estate/properties/${property.slug}`} style={{
                        width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
                        background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', textDecoration: 'none', transition: 'all .15s',
                      }}
                        onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      ><EyeIcon /></Link>
                      <Link 
                        to={`/real-estate/edit-property/${property.slug || property._id}`}
                        style={{
                          width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0',
                          background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#64748b', transition: 'all .15s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                      ><EditIcon /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#94a3b8' }}>
                <HomeIcon />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>No Properties Listed</h3>
              <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 28px' }}>You haven't posted any properties yet. Start today!</p>
              <Link to="/real-estate/post-property" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#2563eb', color: '#fff', textDecoration: 'none',
                padding: '12px 28px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 14px rgba(37,99,235,.2)',
              }}>
                <PlusIcon /> Post Your First Property
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer{0%,100%{opacity:.7}50%{opacity:.4}}
        @media(max-width:900px){.re-stats-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:500px){.re-stats-grid{grid-template-columns:1fr!important}}
        @media(max-width:640px){.re-desktop-only{display:none!important}}
      `}</style>
    </div>
  );
}
