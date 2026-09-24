import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchListings,
  changeListingStatus,
  upgradeListingTier,
  softDeleteListing,
  bulkActionListings,
  fetchListingStats
} from '../../services/listingsApi';
import { createFeaturedBooking } from '../../services/bookingApi';

const TIER_CFG = {
  PLAIN:    { label: 'Basic',    color: '#6b7494', bg: 'rgba(107,116,148,0.1)', border: 'rgba(107,116,148,0.2)', dot: '#9fa6b8' },
  BASIC:    { label: 'Silver',   color: '#475569', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', dot: '#94a3b8' },
  PLATINUM: { label: 'Gold',  color: '#c47011', bg: 'rgba(232,137,12,0.1)', border: 'rgba(232,137,12,0.22)', dot: '#faa219' },
  PREMIUM:  { label: 'Platinum', color: '#3b5bdb', bg: 'rgba(59,91,219,0.08)', border: 'rgba(59,91,219,0.2)', dot: '#748ffc' },
};

const STATUS_CFG = {
  ACTIVE:   { label: 'Active',    cls: 're-status-active' },
  APPROVED: { label: 'Active',    cls: 're-status-active' },
  PENDING:  { label: 'Pending',   cls: 're-status-pending' },
  DRAFT:    { label: 'Draft',     cls: 're-status-draft' },
  PAUSED:   { label: 'Paused',    cls: 're-status-paused' },
  EXPIRED:  { label: 'Expired',   cls: 're-status-rejected' },
  REJECTED: { label: 'Rejected',  cls: 're-status-rejected' },
  ARCHIVED: { label: 'Archived',  cls: 're-status-archived' },
};

const STAT_CARDS = [
  { key: 'credits.featuredSlots', label: 'Credits',       subKey: 'credits.planName',   subPrefix: 'Plan: ', color: '#3b5bdb' },
  { key: 'summary.totalListings', label: 'Total',         subKey: 'summary.activeListings', subPrefix: '', subSuffix: ' active', color: '#0f1629' },
  { key: 'summary.totalViews',    label: 'Total Views',   subKey: null, sub: 'Across all active properties', color: '#7950f2' },
  { key: 'summary.totalLeads',    label: 'Total Leads',   subKey: 'summary.totalShortlists', subSuffix: ' shortlisted', color: '#db2777' },
];

function getNestedVal(obj, path) {
  if (!path) return null;
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

export default function ListingsOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const pathParts = window.location.pathname.split('/');
  const routeTier = pathParts[pathParts.length - 1].toUpperCase();
  const filterTier = ['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'].includes(routeTier) ? routeTier : 'ALL';

  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalCount: 0, totalPages: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') || 'desc');
  const [deletedOnly, setDeletedOnly] = useState(searchParams.get('deleted') === 'true');
  const [upgradeModal, setUpgradeModal] = useState({ open: false, listingId: null, currentTier: 'PLAIN', title: '' });
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (cityFilter) params.city = cityFilter;
    if (sortBy !== 'createdAt') params.sortBy = sortBy;
    if (sortDirection !== 'desc') params.sortDirection = sortDirection;
    if (deletedOnly) params.deleted = 'true';
    params.page = pagination.page.toString();
    setSearchParams(params);
  }, [search, statusFilter, cityFilter, sortBy, sortDirection, deletedOnly, pagination.page]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const listingsData = await fetchListings({
        page: pagination.page, limit: pagination.limit,
        search, status: statusFilter, city: cityFilter,
        sortBy, sortDirection,
        tier: filterTier, deleted: deletedOnly ? 'true' : 'false'
      });
      setListings(listingsData.data || []);
      setPagination(listingsData.pagination || { page: 1, limit: 10, totalCount: 0, totalPages: 1 });
      const statsData = await fetchListingStats();
      setStats(statsData.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load properties list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setSelectedIds([]);
  }, [search, statusFilter, cityFilter, sortBy, sortDirection, filterTier, pagination.page, deletedOnly]);

  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? listings.map(l => l._id) : []);
  const handleSelectRow = (id, checked) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));

  const handleStatusChange = async (id, status) => {
    try { await changeListingStatus(id, status); await loadData(); } catch (err) { alert(err?.response?.data?.message || err.message); }
  };
  const handleTierUpgrade = async (id, targetTier) => {
    try { await upgradeListingTier(id, targetTier); await loadData(); setUpgradeModal({ open: false, listingId: null, currentTier: 'PLAIN', title: '' }); } catch (err) { alert(err?.response?.data?.message || err.message); }
  };
  const handleFeatureSlot = async (id, title) => {
    if (window.confirm(`Submit "${title}" for feature approval?`)) {
      try {
        await createFeaturedBooking(id, 'homepage');
        alert('Feature request submitted successfully. It will go live after admin approval.');
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to submit feature request.');
      }
    }
  };
  const handleSoftDelete = async (id) => {
    if (window.confirm('Archive this property? It will be soft deleted from active listings.')) {
      try { await softDeleteListing(id); await loadData(); } catch (err) { alert(err?.response?.data?.message || err.message); }
    }
  };
  const handleBulkAction = async (action) => {
    if (window.confirm(`Apply "${action}" to ${selectedIds.length} listings?`)) {
      try {
        const res = await bulkActionListings(selectedIds, action);
        alert(`Updated: ${res.data.success.length}. Failed: ${res.data.failed.length}`);
        setSelectedIds([]);
        await loadData();
      } catch (err) { alert(err.message); }
    }
  };

  const fmtMoney = (val) => {
    if (!val) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(Number(val));
  };

  const tierLabel = filterTier === 'ALL' ? 'All Listings' : `${TIER_CFG[filterTier]?.label} Listings`;

  return (
    <div className="re-fade-in">

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div className="re-eyebrow">Portfolio Management</div>
          <h1 className="re-page-title">{tierLabel}</h1>
          <p className="re-page-subtitle">
            Manage listing tiers, track leads, update status and performance metrics.
          </p>
        </div>
        <Link to="/real-estate/post-property" className="re-btn re-btn-dark" style={{ padding: '11px 22px', borderRadius: 14, flexShrink: 0 }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Create Listing
        </Link>
      </div>

      {/* Tier Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'All',     path: '/real-estate/workspace/listings/all' },
          { label: 'Basic',   path: '/real-estate/workspace/listings/plain' },
          { label: 'Silver',  path: '/real-estate/workspace/listings/basic' },
          { label: 'Gold',    path: '/real-estate/workspace/listings/platinum' },
          { label: 'Platinum',path: '/real-estate/workspace/listings/premium' },
        ].map(t => {
          const isActive = window.location.pathname === t.path || (t.label === 'All' && filterTier === 'ALL');
          return (
            <Link key={t.label} to={t.path} style={{
              padding: '7px 16px', borderRadius: 100, fontSize: 12.5, fontWeight: 700,
              textDecoration: 'none',
              background: isActive ? '#0f1629' : '#fff',
              color: isActive ? '#fff' : '#6b7494',
              border: isActive ? '1.5px solid #0f1629' : '1.5px solid rgba(226,230,240,0.9)',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 4px 12px rgba(11,15,26,0.25)' : '0 1px 4px rgba(15,22,50,0.04)',
            }}>
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="re-grid-stats" style={{ marginBottom: 20 }}>
          {STAT_CARDS.map((sc, i) => {
            const val = getNestedVal(stats, sc.key);
            const sub = sc.subKey ? `${sc.subPrefix || ''}${getNestedVal(stats, sc.subKey) || 0}${sc.subSuffix || ''}` : sc.sub;
            return (
              <div key={i} className="re-stat-card" style={{
                '--stat-accent': sc.color,
                '--stat-bg': `${sc.color}18`,
                border: `1px solid ${sc.color}22`,
              }}>
                <div className="re-stat-label">{sc.label}</div>
                <div className="re-stat-value" style={{ fontSize: 30 }}>{val ?? 0}</div>
                <div className="re-stat-hint">{sub}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="re-toolbar" style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }} className="listings-filter-grid">
          <div>
            <label className="re-label">Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search title, city, locality…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="re-input"
                style={{ paddingLeft: 38 }}
              />
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} width="15" height="15" fill="none" stroke="#0f1629" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
          <div>
            <label className="re-label">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="re-select">
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="EXPIRED">Expired</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="re-label">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="re-select">
              <option value="createdAt">Posted Date</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div>
            <label className="re-label">Direction</label>
            <select value={sortDirection} onChange={e => setSortDirection(e.target.value)} className="re-select">
              <option value="desc">Newest / Highest</option>
              <option value="asc">Oldest / Lowest</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 22 }}>
            <input
              type="checkbox" id="deletedOnlyCheck"
              checked={deletedOnly}
              onChange={e => { setDeletedOnly(e.target.checked); setPagination(p => ({ ...p, page: 1 })); }}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#f03e5e' }}
            />
            <label htmlFor="deletedOnlyCheck" style={{ fontSize: 12.5, fontWeight: 700, color: '#f03e5e', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Archived Only
            </label>
          </div>
        </div>
      </div>

      {/* Table Panel */}
      <div className="re-panel">
        {loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="re-spinner re-spinner-dark" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#9fa6b8', fontSize: 14, fontWeight: 600 }}>Loading listings…</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px 28px', background: 'rgba(240,62,94,0.06)', color: '#f03e5e', fontWeight: 600, fontSize: 13.5, borderRadius: '0 0 18px 18px' }}>{error}</div>
        ) : listings.length === 0 ? (
          <div className="re-empty">
            <div className="re-empty-icon" style={{ color: '#9fa6b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1629', margin: '0 0 8px', letterSpacing: '-0.02em' }}>No Listings Found</h3>
            <p style={{ margin: '0 0 24px', color: '#9fa6b8', fontSize: 14 }}>Adjust your filters or create your first listing.</p>
            <Link to="/real-estate/post-property" className="re-btn re-btn-primary" style={{ borderRadius: 12 }}>Create First Listing</Link>
          </div>
        ) : (
          <div className="re-table-wrap">
            <table className="re-table">
              <thead>
                <tr>
                  <th style={{ width: 44, paddingLeft: 22 }}>
                    <input type="checkbox" checked={selectedIds.length === listings.length && listings.length > 0} onChange={handleSelectAll} style={{ cursor: 'pointer', accentColor: '#3b5bdb' }} />
                  </th>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th>Performance</th>
                  <th style={{ textAlign: 'right', paddingRight: 22 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(item => {
                  const tier = TIER_CFG[item.tier || 'PLAIN'];
                  const status = STATUS_CFG[item.status || 'DRAFT'];
                  const isChecked = selectedIds.includes(item._id);
                  return (
                    <tr key={item._id} style={{ background: isChecked ? 'rgba(59,91,219,0.04)' : 'transparent' }}>
                      <td style={{ paddingLeft: 22 }}>
                        <input type="checkbox" checked={isChecked} onChange={e => handleSelectRow(item._id, e.target.checked)} style={{ cursor: 'pointer', accentColor: '#3b5bdb' }} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={item.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'}
                            alt={item.title}
                            style={{ width: 46, height: 46, borderRadius: 10, objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(15,22,50,0.1)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f1629', fontSize: 13.5 }}>{item.title}</div>
                            <div style={{ color: '#9fa6b8', fontSize: 11.5, marginTop: 2, textTransform: 'capitalize' }}>{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#303860' }}>{item.locality || 'N/A'}</div>
                        <div style={{ color: '#9fa6b8', fontSize: 11.5, marginTop: 2 }}>{item.city || 'N/A'}</div>
                      </td>
                      <td style={{ fontWeight: 800, color: '#0f1629', fontSize: 13.5 }}>₹{fmtMoney(item.pricing?.amount || item.price)}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 100,
                          fontSize: 11, fontWeight: 800,
                          background: tier.bg, color: tier.color, border: `1px solid ${tier.border}`,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: tier.dot, display: 'inline-block' }} />
                          {tier.label}
                        </span>
                      </td>
                      <td>
                        <span className={`re-badge ${status.cls}`}>{status.label}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 14 }}>
                          <div style={{ fontSize: 12.5, color: '#6b7494', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            <strong style={{ color: '#0f1629', fontWeight: 800 }}>{item.metrics?.views || 0}</strong>
                          </div>
                          <div style={{ fontSize: 12.5, color: '#6b7494', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <strong style={{ color: '#0f1629', fontWeight: 800 }}>{item.metrics?.leads || 0}</strong>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 22, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 7 }}>
                          <Link to={`/real-estate/edit-property/${item.slug}`} style={{
                            padding: '6px 14px', border: '1.5px solid rgba(226,230,240,0.9)',
                            borderRadius: 8, background: '#fff',
                            color: '#303860', textDecoration: 'none',
                            fontSize: 12, fontWeight: 700,
                            transition: 'all 0.15s ease',
                          }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#3b5bdb'; e.currentTarget.style.color = '#3b5bdb'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(226,230,240,0.9)'; e.currentTarget.style.color = '#303860'; }}
                          >Edit</Link>

                          <button
                            onClick={() => setUpgradeModal({ open: true, listingId: item._id, currentTier: item.tier || 'PLAIN', title: item.title })}
                            style={{
                              padding: '6px 14px',
                              border: '1.5px solid rgba(59,91,219,0.2)',
                              borderRadius: 8, background: 'rgba(59,91,219,0.06)',
                              color: '#3b5bdb', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              fontFamily: 'inherit',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(59,91,219,0.12)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(59,91,219,0.06)'; }}
                          >Upgrade</button>

                          <button
                            onClick={() => handleFeatureSlot(item._id, item.title)}
                            style={{
                              padding: '6px 14px',
                              border: '1.5px solid rgba(250,162,25,0.2)',
                              borderRadius: 8, background: 'rgba(250,162,25,0.06)',
                              color: '#c47011', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              fontFamily: 'inherit',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(250,162,25,0.12)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(250,162,25,0.06)'; }}
                          >Feature</button>

                          <div style={{ position: 'relative' }}>
                            <button
                              onClick={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}
                              style={{
                                width: 32, height: 32, border: '1.5px solid rgba(226,230,240,0.9)',
                                borderRadius: 8, background: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 15, transition: 'all 0.15s ease',
                                fontFamily: 'inherit',
                              }}
                              onMouseOver={e => { e.currentTarget.style.borderColor = '#9fa6b8'; }}
                              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(226,230,240,0.9)'; }}
                            >⋮</button>

                            {menuOpenId === item._id && (
                              <div style={{
                                position: 'absolute', right: 0, top: 38,
                                background: '#0f1629',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12,
                                boxShadow: '0 16px 40px rgba(11,15,26,0.4)',
                                zIndex: 9999, minWidth: 160,
                                overflow: 'hidden',
                                animation: 'slideUp 0.15s ease',
                              }}>
                                {[
                                  { label: 'Set Active', action: () => { handleStatusChange(item._id, 'ACTIVE'); setMenuOpenId(null); }, color: '#20c997' },
                                  { label: 'Pause',     action: () => { handleStatusChange(item._id, 'PAUSED'); setMenuOpenId(null); }, color: '#fbbf5e' },
                                  { label: 'Archive',   action: () => { handleSoftDelete(item._id); setMenuOpenId(null); }, color: '#ff8787' },
                                ].map((a, idx) => (
                                  <button key={a.label} onClick={a.action} style={{
                                    display: 'block', width: '100%', padding: '12px 18px',
                                    background: 'none', border: 'none', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'left',
                                    fontSize: 13, cursor: 'pointer', color: a.color,
                                    fontWeight: 700, transition: 'background 0.12s ease',
                                    fontFamily: 'inherit', letterSpacing: '0.02em'
                                  }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                                  >{a.label}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="re-pagination">
          <span className="re-pagination-info">
            Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong> &nbsp;·&nbsp; {pagination.totalCount} listings
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="re-pagi-btn" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>
              ← Previous
            </button>
            <button className="re-pagi-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Float Bar */}
      {selectedIds.length > 0 && (
        <div className="re-float-bar">
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
            {selectedIds.length} selected
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Activate', action: 'ACTIVATE', bg: '#0d9276' },
              { label: 'Pause',    action: 'PAUSE',    bg: '#e8890c' },
              { label: 'Archive',  action: 'ARCHIVE',  bg: '#f03e5e' },
            ].map(b => (
              <button key={b.label} onClick={() => handleBulkAction(b.action)} style={{
                background: b.bg, border: 'none', color: '#fff',
                padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'filter 0.15s',
              }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >{b.label}</button>
            ))}
          </div>
          <button onClick={() => setSelectedIds([])} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
            fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
          }}>Clear</button>
        </div>
      )}

      {/* Upgrade Modal */}
      {upgradeModal.open && (
        <div className="re-overlay" onClick={() => setUpgradeModal({ open: false, listingId: null, currentTier: 'PLAIN', title: '' })}>
          <div className="re-modal" onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 21, fontWeight: 900, color: '#0f1629', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
                Upgrade Package Tier
              </h2>
              <p style={{ margin: 0, fontSize: 13.5, color: '#9fa6b8' }}>
                Select promotion tier for <strong style={{ color: '#0f1629' }}>{upgradeModal.title}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'].map(tierName => {
                const t = TIER_CFG[tierName];
                const cost = { PLAIN: 'Free', BASIC: '1 Credit', PLATINUM: '3 Credits', PREMIUM: '5 Credits' };
                const isCurrent = upgradeModal.currentTier === tierName;
                return (
                  <button key={tierName} disabled={isCurrent} onClick={() => handleTierUpgrade(upgradeModal.listingId, tierName)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 18px', borderRadius: 14, cursor: isCurrent ? 'not-allowed' : 'pointer',
                      background: isCurrent ? t.bg : '#fff',
                      border: isCurrent ? `2px solid ${t.color}` : '1.5px solid rgba(226,230,240,0.9)',
                      textAlign: 'left', transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseOver={e => { if (!isCurrent) e.currentTarget.style.borderColor = t.color; }}
                    onMouseOut={e => { if (!isCurrent) e.currentTarget.style.borderColor = 'rgba(226,230,240,0.9)'; }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f1629', fontSize: 14 }}>{t.label}</div>
                      <div style={{ fontSize: 12, color: '#9fa6b8', marginTop: 3 }}>{cost[tierName]} deduction</div>
                    </div>
                    {isCurrent && <span style={{ fontSize: 11, fontWeight: 800, color: t.color }}>Current Tier</span>}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setUpgradeModal({ open: false, listingId: null, currentTier: 'PLAIN', title: '' })}
              className="re-btn re-btn-dark re-btn-full"
              style={{ borderRadius: 12, padding: '13px 20px' }}
            >Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) { .listings-filter-grid { grid-template-columns: 1fr 1fr 1fr !important; } }
        @media (max-width: 768px)  { .listings-filter-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px)  { .re-grid-stats { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}
