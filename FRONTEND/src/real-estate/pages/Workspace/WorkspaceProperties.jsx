import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkspaceProperties } from '../../services/workspaceApi';
import '../../re.css';

const STATUS_STYLES = {
  APPROVED: { bg: 'rgba(13,146,118,0.1)', color: '#0d9276', border: 'rgba(13,146,118,0.2)' },
  PENDING:  { bg: 'rgba(232,137,12,0.1)',  color: '#e8890c', border: 'rgba(232,137,12,0.2)' },
  REJECTED: { bg: 'rgba(240,62,94,0.1)',  color: '#f03e5e', border: 'rgba(240,62,94,0.2)' },
  DRAFT:    { bg: 'rgba(107,116,148,0.1)', color: '#6b7494', border: 'rgba(107,116,148,0.2)' },
};

function formatMoney(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value));
}

function WorkspacePropertyCard({ property }) {
  const image = property?.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80';
  const statusStyle = STATUS_STYLES[property.status] || STATUS_STYLES.DRAFT;

  return (
    <div className="re-card re-lift" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
        <img src={image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 100,
          background: '#fff', color: statusStyle.color,
          fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {property.status}
        </div>
      </div>
      
      <div className="re-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: '#0f1629', lineHeight: 1.3 }} className="re-line-clamp-2">
            {property.title}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#9fa6b8', fontWeight: 500 }}>
            📍 {property.locality || 'Prime Location'} · {property.city || 'Unknown city'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 'auto' }}>
          <div style={{ background: '#f8f9fc', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(226,230,240,0.6)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#9fa6b8', letterSpacing: '0.08em' }}>Price</div>
            <div style={{ marginTop: 4, fontSize: 14, fontWeight: 900, color: '#3b5bdb' }}>₹{formatMoney(property.pricing?.amount || property.price)}</div>
          </div>
          <div style={{ background: '#f8f9fc', borderRadius: 12, padding: '10px 14px', border: '1px solid rgba(226,230,240,0.6)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#9fa6b8', letterSpacing: '0.08em' }}>Type</div>
            <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: '#0f1629', textTransform: 'capitalize' }}>{property.category || 'Property'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(226,230,240,0.8)' }}>
          <div style={{ fontSize: 12, color: '#9fa6b8', fontWeight: 500 }}>
            Updated {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'recently'}
          </div>
          <Link to={`/real-estate/edit-property/${property.slug || property._id}`} style={{
            fontSize: 12.5, fontWeight: 800, color: '#3b5bdb', textDecoration: 'none',
            background: 'rgba(59,91,219,0.08)', padding: '6px 14px', borderRadius: 8,
            transition: 'all 0.15s ease',
          }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(59,91,219,0.15)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(59,91,219,0.08)'}
          >
            Edit →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceProperties() {
  const [state, setState] = useState({ loading: true, error: '', data: [], pagination: null, filters: { status: 'all', search: '', sortBy: 'createdAt', sortDirection: 'desc' } });
  const [query, setQuery] = useState({ page: 1, limit: 12, status: 'all', search: '', sortBy: 'createdAt', sortDirection: 'desc' });

  useEffect(() => {
    let alive = true;
    setState((prev) => ({ ...prev, loading: true, error: '' }));

    fetchWorkspaceProperties(query)
      .then((response) => {
        if (!alive) return;
        setState({ loading: false, error: '', data: response.data || [], pagination: response.pagination || null, filters: response.filters || query });
      })
      .catch((error) => {
        if (!alive) return;
        setState((prev) => ({ ...prev, loading: false, error: error?.response?.data?.message || error.message || 'Unable to load properties' }));
      });

    return () => {
      alive = false;
    };
  }, [query]);

  const pageInfo = useMemo(() => {
    const pagination = state.pagination;
    if (!pagination) return 'No results yet';
    return `Page ${pagination.page} of ${pagination.totalPages} · ${pagination.totalCount} properties`;
  }, [state.pagination]);

  return (
    <div className="re-fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div className="re-eyebrow">Workspace / Properties</div>
          <h1 className="re-page-title">My Properties</h1>
          <p className="re-page-subtitle">Paginated property management for the seller/dealer workspace with search and filters.</p>
        </div>
        <Link to="/real-estate/post" className="re-btn re-btn-dark" style={{ padding: '11px 22px', borderRadius: 14 }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Create Property
        </Link>
      </div>

      <div className="re-toolbar" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <label className="re-label">Search</label>
            <input
              value={query.search}
              onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, search: e.target.value }))}
              placeholder="Search title, city..."
              className="re-input"
              style={{ paddingLeft: 36 }}
            />
            <svg style={{ position: 'absolute', left: 12, bottom: 12, opacity: 0.4 }} width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <div>
            <label className="re-label">Status</label>
            <select className="re-select" value={query.status} onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, status: e.target.value }))}>
              <option value="all">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <label className="re-label">Sort</label>
            <select className="re-select" value={query.sortDirection} onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, sortDirection: e.target.value }))}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16, color: '#6b7494', fontSize: 13, fontWeight: 600 }}>{pageInfo}</div>

      {state.loading ? (
        <div className="re-grid-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="re-skeleton" style={{ height: 380, borderRadius: 20 }} />
          ))}
        </div>
      ) : state.error ? (
        <div style={{ background: 'rgba(240,62,94,0.06)', border: '1px solid rgba(240,62,94,0.2)', color: '#f03e5e', borderRadius: 18, padding: 24, fontWeight: 600 }}>
          {state.error}
        </div>
      ) : state.data.length ? (
        <div className="re-grid-3">
          {state.data.map((property) => <WorkspacePropertyCard key={property._id} property={property} />)}
        </div>
      ) : (
        <div className="re-empty">
          <div className="re-empty-icon">🏠</div>
          <h3 style={{ margin: '0 0 8px', color: '#0f1629', fontSize: 18, fontWeight: 800 }}>No properties found</h3>
          <p style={{ margin: 0, color: '#9fa6b8', fontSize: 14 }}>Try adjusting your search criteria or create a new listing.</p>
        </div>
      )}
    </div>
  );
}