import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkspaceProperties } from '../../services/workspaceApi';

const STATUS_STYLES = {
  APPROVED: { bg: '#dcfce7', color: '#166534' },
  PENDING: { bg: '#fef3c7', color: '#92400e' },
  REJECTED: { bg: '#fee2e2', color: '#b91c1c' },
  DRAFT: { bg: '#e2e8f0', color: '#334155' },
};

function formatMoney(value) {
  if (value === null || value === undefined || value === '') return 'N/A';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value));
}

function WorkspacePropertyCard({ property }) {
  const image = property?.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80';
  const statusStyle = STATUS_STYLES[property.status] || STATUS_STYLES.DRAFT;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,.04)' }}>
      <div style={{ aspectRatio: '16 / 10', background: '#e2e8f0' }}>
        <img src={image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{property.title}</h3>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>{property.city || 'Unknown city'} · {property.locality || 'Unknown locality'}</p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 900, padding: '6px 10px', borderRadius: 999, background: statusStyle.bg, color: statusStyle.color }}>{property.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#64748b' }}>Price</div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>₹{formatMoney(property.pricing?.amount || property.price)}</div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 14, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: '#64748b' }}>Type</div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{property.category || 'Property'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Updated {property.updatedAt ? new Date(property.updatedAt).toLocaleDateString() : 'recently'}</div>
          <Link to={`/real-estate/edit-property/${property.slug || property._id}`} style={{ fontSize: 13, fontWeight: 900, color: '#2563eb', textDecoration: 'none' }}>Edit</Link>
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
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.18em' }}>Workspace / Properties</div>
          <h1 style={{ margin: '10px 0 6px', fontSize: 'clamp(28px, 4vw, 40px)', color: '#0f172a', letterSpacing: '-.04em' }}>My Properties</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>Paginated property management for the seller/dealer workspace with search and status filters.</p>
        </div>
        <Link to="/real-estate/post" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', textDecoration: 'none', borderRadius: 14, padding: '12px 16px', fontSize: 13, fontWeight: 900 }}>Create Property</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 16 }} className="workspace-properties-filters">
        <input
          value={query.search}
          onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, search: e.target.value }))}
          placeholder="Search title, city, locality"
          style={{ gridColumn: 'span 2', border: '1px solid #cbd5e1', borderRadius: 14, padding: '12px 14px', fontSize: 14, outline: 'none' }}
        />
        <select value={query.status} onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, status: e.target.value }))} style={{ border: '1px solid #cbd5e1', borderRadius: 14, padding: '12px 14px', fontSize: 14 }}>
          <option value="all">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select value={query.sortDirection} onChange={(e) => setQuery((prev) => ({ ...prev, page: 1, sortDirection: e.target.value }))} style={{ border: '1px solid #cbd5e1', borderRadius: 14, padding: '12px 14px', fontSize: 14 }}>
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

      <div style={{ marginBottom: 14, color: '#64748b', fontSize: 13 }}>{pageInfo}</div>

      {state.loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }} className="workspace-properties-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} style={{ height: 360, borderRadius: 18, background: 'linear-gradient(90deg, #e2e8f0, #f8fafc, #e2e8f0)', backgroundSize: '200% 100%', animation: 'workspace-shimmer 1.2s ease-in-out infinite' }} />
          ))}
        </div>
      ) : state.error ? (
        <div style={{ background: '#fff', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 18, padding: 18 }}>{state.error}</div>
      ) : state.data.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }} className="workspace-properties-grid">
          {state.data.map((property) => <WorkspacePropertyCard key={property._id} property={property} />)}
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: 18, padding: 28, textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', color: '#0f172a' }}>No properties found</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Try adjusting the search or create a new listing for this workspace.</p>
        </div>
      )}

      <style>{`@keyframes workspace-shimmer {0%{background-position:0 0}100%{background-position:200% 0}} @media (max-width: 1024px) { .workspace-properties-grid, .workspace-properties-filters { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } } @media (max-width: 768px) { .workspace-properties-grid, .workspace-properties-filters { grid-template-columns: 1fr !important; } input[placeholder='Search title, city, locality'] { grid-column: auto !important; } }`}</style>
    </div>
  );
}