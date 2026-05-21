import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import api from '../services/api/axios';
import PropertyStatusBadge from '../components/PropertyStatusBadge';

const STAT_CONFIG = [
  { key: 'active',  label: 'Active Listings',  icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, accent: '#3b5bdb', bg: 'rgba(59,91,219,0.1)',  border: 'rgba(59,91,219,0.18)' },
  { key: 'pending', label: 'Pending Review',   icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, accent: '#e8890c', bg: 'rgba(232,137,12,0.1)', border: 'rgba(232,137,12,0.18)' },
  { key: 'views',   label: 'Total Views',      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, accent: '#0d9276', bg: 'rgba(13,146,118,0.1)', border: 'rgba(13,146,118,0.18)' },
  { key: 'leads',   label: 'Leads Generated',  icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, accent: '#7950f2', bg: 'rgba(121,80,242,0.1)', border: 'rgba(121,80,242,0.18)' },
];

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
          logout(); localStorage.removeItem('user'); localStorage.removeItem('token');
          navigate('/real-estate/login');
        } else { setError(errMsg); setLoading(false); }
      });
  }, [navigate, logout]);

  const totalViews = items.reduce((acc, i) => acc + (i.views || 0), 0);
  const totalLeads = items.reduce((acc, i) => acc + (i.leads?.length || i.leadsCount || 0), 0);

  const statValues = {
    active:  items.filter(i => i.status === 'APPROVED').length,
    pending: items.filter(i => i.status === 'PENDING').length,
    views:   totalViews,
    leads:   totalLeads,
  };

  return (
    <div className="re-fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b0f1a 0%, #1a2550 50%, #2537a0 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(11,15,26,0.25)',
      }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,91,219,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 120, width: 120, height: 120, borderRadius: '50%', background: 'rgba(250,162,25,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(186,200,255,0.8)', marginBottom: 8 }}>
              Welcome Back
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.04em' }}>
              Hello, {user?.name?.split(' ')[0] || 'Member'}
            </h1>
            <p style={{ color: 'rgba(186,200,255,0.75)', fontSize: 14, fontWeight: 500, margin: 0 }}>
              Manage your properties and track your performance from here.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/real-estate/post-property" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #faa219, #e8890c)',
              color: '#0b0f1a',
              textDecoration: 'none',
              padding: '11px 22px', borderRadius: 12,
              fontWeight: 800, fontSize: 14,
              boxShadow: '0 4px 16px rgba(234,137,12,0.4)',
              transition: 'all 0.2s ease',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(234,137,12,0.5)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(234,137,12,0.4)'; }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Post Property
            </Link>
            <button onClick={handleLogout} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '11px 18px', borderRadius: 12,
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="re-grid-stats" style={{ marginBottom: 24 }}>
        {STAT_CONFIG.map(s => (
          <div key={s.key} className="re-stat-card" style={{
            '--stat-accent': s.accent,
            '--stat-bg': s.bg,
            border: `1px solid ${s.border}`,
          }}>
            <div className="re-stat-icon">{s.icon}</div>
            <div className="re-stat-label">{s.label}</div>
            <div className="re-stat-value" style={{ fontSize: 32 }}>
              {loading ? (
                <div className="re-skeleton" style={{ width: 60, height: 32, borderRadius: 8 }} />
              ) : statValues[s.key]}
            </div>
          </div>
        ))}
      </div>

      {/* Workspace Callout
      <div className="re-callout" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#3b5bdb', marginBottom: 6 }}>
            Seller & Dealer Workspace
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#0f1629' }}>
            Advanced Portfolio Management
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7494', lineHeight: 1.6 }}>
            Access multi-tenant team tools, listing packages, lead workflows, and live campaign analytics.
          </p>
        </div>
        <Link to="/real-estate/workspace" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
          color: '#fff', textDecoration: 'none',
          fontSize: 13, fontWeight: 800,
          padding: '11px 22px', borderRadius: 12,
          boxShadow: '0 4px 16px rgba(59,91,219,0.3)',
          transition: 'all 0.18s ease',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,91,219,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,91,219,0.3)'; }}
        >
          Launch Workspace →
        </Link>
      </div>
      */}

      {/* Listings Panel */}
      <div className="re-panel">
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(226,230,240,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f1629', margin: 0, letterSpacing: '-0.02em' }}>
              Your Listings
            </h2>
            <p style={{ fontSize: 12, color: '#9fa6b8', margin: '3px 0 0', fontWeight: 500 }}>
              {loading ? 'Loading...' : `${items.length} properties`}
            </p>
          </div>
          <Link to="/real-estate/workspace/listings/all" style={{
            fontSize: 12.5, fontWeight: 700, color: '#3b5bdb',
            textDecoration: 'none',
            padding: '7px 14px',
            background: 'rgba(59,91,219,0.08)',
            borderRadius: 8, border: '1px solid rgba(59,91,219,0.15)',
            transition: 'all 0.18s ease',
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(59,91,219,0.14)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(59,91,219,0.08)'; }}
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '16px 20px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f1f3f9' }}>
                <div className="re-skeleton" style={{ width: 60, height: 60, borderRadius: 12, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="re-skeleton" style={{ width: '50%', height: 14, borderRadius: 6, marginBottom: 8 }} />
                  <div className="re-skeleton" style={{ width: '30%', height: 10, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#6b7494', fontWeight: 500 }}>{error}</div>
          </div>
        ) : items.length > 0 ? (
          <div>
            {items.map((property, idx) => (
              <div key={property._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16, padding: '14px 24px',
                borderBottom: idx < items.length - 1 ? '1px solid rgba(226,230,240,0.6)' : 'none',
                transition: 'background 0.15s ease',
              }}
                onMouseOver={e => e.currentTarget.style.background = '#f8f9fc'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 58, height: 58, borderRadius: 12, overflow: 'hidden',
                    background: '#f1f3f9', flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(15,22,50,0.08)',
                  }}>
                    <img
                      src={((property.media && property.media.length > 0) ? property.media : (property.images || []))[0]?.url ||
                           ((property.media && property.media.length > 0) ? property.media : (property.images || []))[0] ||
                           'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'}
                      alt={property.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <h3 style={{ fontSize: 13.5, fontWeight: 800, color: '#0f1629', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {property.title}
                      </h3>
                      <PropertyStatusBadge status={property.status} />
                    </div>
                    <p style={{ fontSize: 12, color: '#9fa6b8', fontWeight: 500, margin: 0 }}>
                      📍 {property.locality || 'Prime Location'} · {property.city}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right', paddingRight: 14, borderRight: '1px solid rgba(226,230,240,0.8)' }} className="re-hide-mobile">
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9fa6b8', marginBottom: 3 }}>
                      Leads
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f1629' }}>
                      {property.leads?.length || property.leadsCount || 0}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/real-estate/properties/${property.slug}`} style={{
                      width: 34, height: 34, borderRadius: 8,
                      border: '1px solid rgba(226,230,240,0.9)',
                      background: '#f8f9fc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#9fa6b8', textDecoration: 'none', transition: 'all 0.15s ease',
                    }}
                      onMouseOver={e => { e.currentTarget.style.background = 'rgba(59,91,219,0.08)'; e.currentTarget.style.color = '#3b5bdb'; e.currentTarget.style.borderColor = 'rgba(59,91,219,0.2)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#f8f9fc'; e.currentTarget.style.color = '#9fa6b8'; e.currentTarget.style.borderColor = 'rgba(226,230,240,0.9)'; }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </Link>
                    <Link to={`/real-estate/edit-property/${property.slug || property._id}`} style={{
                      width: 34, height: 34, borderRadius: 8,
                      border: '1px solid rgba(226,230,240,0.9)',
                      background: '#f8f9fc',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#9fa6b8', textDecoration: 'none', transition: 'all 0.15s ease',
                    }}
                      onMouseOver={e => { e.currentTarget.style.background = '#0f1629'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f1629'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#f8f9fc'; e.currentTarget.style.color = '#9fa6b8'; e.currentTarget.style.borderColor = 'rgba(226,230,240,0.9)'; }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(59,91,219,0.08), rgba(37,55,160,0.05))',
              border: '1px solid rgba(59,91,219,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', color: '#3b5bdb',
            }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1629', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              No Properties Listed Yet
            </h3>
            <p style={{ color: '#9fa6b8', fontSize: 14, margin: '0 0 28px', fontWeight: 500 }}>
              Start publishing your first property today and reach 50,000+ active buyers.
            </p>
            <Link to="/real-estate/post-property" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
              color: '#fff', textDecoration: 'none',
              padding: '13px 28px', borderRadius: 12,
              fontWeight: 700, fontSize: 14,
              boxShadow: '0 4px 16px rgba(59,91,219,0.3)',
            }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Post Your First Property
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:900px){.re-grid-stats{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:500px){.re-grid-stats{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
