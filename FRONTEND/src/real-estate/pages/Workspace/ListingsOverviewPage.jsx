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

// Premium badges & chip styles matching Option D: Action & Performance Theme
const TIER_STYLES = {
  PLAIN: { bg: '#f1f5f9', text: '#475569', label: 'Basic', border: '1px solid #cbd5e1' },
  BASIC: { bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', text: '#475569', label: 'Silver', border: '1px solid #cbd5e1', shadow: '0 4px 12px rgba(148, 163, 184, 0.12)' },
  PLATINUM: { bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', text: '#d97706', label: 'Gold ⭐', border: '1px solid #fde68a', shadow: '0 4px 12px rgba(245, 158, 11, 0.15)' },
  PREMIUM: { bg: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', text: '#0f172a', label: 'Platinum 💎', border: '1px solid #475569', shadow: '0 4px 16px rgba(15, 23, 42, 0.15)' }
};

const TIER_DISPLAY_NAMES = {
  PLAIN: 'Basic',
  BASIC: 'Silver',
  PLATINUM: 'Gold',
  PREMIUM: 'Platinum'
};

const STATUS_STYLES = {
  ACTIVE: { bg: '#dcfce7', text: '#15803d', label: 'Active' },
  APPROVED: { bg: '#dcfce7', text: '#15803d', label: 'Active' },
  PENDING: { bg: '#fef3c7', text: '#b45309', label: 'Pending Review' },
  DRAFT: { bg: '#f1f5f9', text: '#64748b', label: 'Draft' },
  PAUSED: { bg: '#fee2e2', text: '#b91c1c', label: 'Paused' },
  EXPIRED: { bg: '#fef2f2', text: '#991b1b', label: 'Expired' },
  REJECTED: { bg: '#fef2f2', text: '#991b1b', label: 'Rejected' },
  ARCHIVED: { bg: '#e2e8f0', text: '#475569', label: 'Archived' }
};

export default function ListingsOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Route matches tier from /workspace/listings/:tier
  const pathParts = window.location.pathname.split('/');
  const routeTier = pathParts[pathParts.length - 1].toUpperCase();
  const filterTier = ['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'].includes(routeTier) ? routeTier : 'ALL';

  // React State
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

  // Modals state
  const [upgradeModal, setUpgradeModal] = useState({ open: false, listingId: null, currentTier: 'PLAIN', title: '' });
  const [statusModal, setStatusModal] = useState({ open: false, listingId: null, targetStatus: '', title: '' });
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Sync params with URL state
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

  // Load Data
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const listingsData = await fetchListings({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: statusFilter,
        city: cityFilter,
        sortBy,
        sortDirection,
        tier: filterTier,
        deleted: deletedOnly ? 'true' : 'false'
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

  // Debounced search logic could be integrated here, for now it's simple or reactive
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(listings.map(l => l._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  // Quick Action: Status Change
  const handleStatusChange = async (id, status) => {
    try {
      await changeListingStatus(id, status);
      await loadData();
      setStatusModal({ open: false, listingId: null, targetStatus: '', title: '' });
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  // Quick Action: Tier Upgrade
  const handleTierUpgrade = async (id, targetTier) => {
    try {
      await upgradeListingTier(id, targetTier);
      await loadData();
      setUpgradeModal({ open: false, listingId: null, currentTier: 'PLAIN', title: '' });
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  // Quick Action: Soft Delete
  const handleSoftDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this property? It will be soft deleted from active listings.')) {
      try {
        await softDeleteListing(id);
        await loadData();
      } catch (err) {
        alert(err?.response?.data?.message || err.message);
      }
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action) => {
    if (window.confirm(`Apply ${action} to the ${selectedIds.length} selected listings?`)) {
      try {
        const res = await bulkActionListings(selectedIds, action);
        alert(`Successfully updated: ${res.data.success.length}. Failed: ${res.data.failed.length}`);
        setSelectedIds([]);
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const formattedMoney = (val) => {
    if (!val) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(Number(val));
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px 80px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.18em' }}>Doltech Real Estate</div>
          <h1 style={{ margin: '8px 0 4px', fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-.02em' }}>
            {filterTier === 'ALL' ? 'All Listings' : `${TIER_STYLES[filterTier]?.label} Listings`}
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
            Enterprise property portfolio dashboard. Manage package tiers, lead conversions, and performance stats.
          </p>
        </div>
        <Link to="/real-estate/post" style={{ background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s ease' }}>
          <span>+ Create Listing</span>
        </Link>
      </div>

      {/* 2. Listing Summary / Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, boxShadow: '0 4px 20px rgba(15,23,42,.03)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Credits Remaining</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#2563eb', marginTop: 8 }}>{stats.credits?.featuredSlots || 0}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, textTransform: 'uppercase' }}>Plan: {stats.credits?.planName || 'N/A'}</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, boxShadow: '0 4px 20px rgba(15,23,42,.03)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Properties</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>{stats.summary?.totalListings || 0}</div>
            <div style={{ fontSize: 11, color: '#16a34a', marginTop: 6 }}>{stats.summary?.activeListings || 0} Active Listings</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, boxShadow: '0 4px 20px rgba(15,23,42,.03)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Views</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#7c3aed', marginTop: 8 }}>{stats.summary?.totalViews || 0}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>Across all active properties</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, boxShadow: '0 4px 20px rgba(15,23,42,.03)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Leads Generated</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#db2777', marginTop: 8 }}>{stats.summary?.totalLeads || 0}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{stats.summary?.totalShortlists || 0} Saved shortlist items</div>
          </div>

        </div>
      )}

      {/* 3. Filtering Toolbar */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 20, marginBottom: 20, boxShadow: '0 4px 20px rgba(15,23,42,.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          
          <div>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Search</label>
            <input
              type="text"
              placeholder="Search Title, City, Locality"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 12, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 12, fontSize: 13, outline: 'none' }}
            >
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING">Pending review</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="EXPIRED">Expired</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 12, fontSize: 13, outline: 'none' }}
            >
              <option value="createdAt">Posted Date</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: 6 }}>Direction</label>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 12, fontSize: 13, outline: 'none' }}
            >
              <option value="desc">Newest / Highest</option>
              <option value="asc">Oldest / Lowest</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'center', marginTop: 18 }}>
            <input
              type="checkbox"
              id="deletedOnlyCheck"
              checked={deletedOnly}
              onChange={(e) => {
                setDeletedOnly(e.target.checked);
                setPagination(p => ({ ...p, page: 1 }));
              }}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="deletedOnlyCheck" style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', cursor: 'pointer' }}>Show Deleted Only</label>
          </div>

        </div>
      </div>

      {/* 4. Main Listings Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,.02)' }}>
        
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Loading listings...</div>
          </div>
        ) : error ? (
          <div style={{ padding: 32, background: '#fef2f2', color: '#b91c1c', fontWeight: 600 }}>{error}</div>
        ) : listings.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
            <h3 style={{ fontSize: 18, color: '#0f172a', margin: '0 0 8px' }}>No Listings Found</h3>
            <p style={{ margin: 0, fontSize: 14 }}>Try adjusting your filters, searching, or create your first real estate listing.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '16px 20px', width: 40 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === listings.length}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b' }}>Property Title</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b' }}>City / Locality</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b' }}>Price</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b' }}>Tier</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b' }}>Status</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b' }}>Performance</th>
                  <th style={{ padding: '16px 20px', fontWeight: 800, color: '#64748b', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((item) => {
                  const tierStyle = TIER_STYLES[item.tier || 'PLAIN'];
                  const statusStyle = STATUS_STYLES[item.status || 'DRAFT'];
                  const isChecked = selectedIds.includes(item._id);

                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background .15s ease', background: isChecked ? '#eff6ff' : 'transparent' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(item._id, e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={item.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80'}
                            alt={item.title}
                            style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{item.title}</div>
                            <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#334155' }}>
                        <div>{item.locality || 'N/A'}</div>
                        <div style={{ color: '#94a3b8', fontSize: 11 }}>{item.city || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0f172a' }}>
                        ₹{formattedMoney(item.pricing?.amount || item.price)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: tierStyle.bg,
                          color: tierStyle.text,
                          border: tierStyle.border,
                          boxShadow: tierStyle.shadow || 'none'
                        }}>
                          {tierStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: statusStyle.bg,
                          color: statusStyle.text
                        }}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div>👀 <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.metrics?.views || 0}</span></div>
                          <div>✉️ <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.metrics?.leads || 0}</span></div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          
                          <Link to={`/real-estate/edit-property/${item.slug}`} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 12 }}>
                            Edit
                          </Link>
                          
                          <button
                            onClick={() => setUpgradeModal({ open: true, listingId: item._id, currentTier: item.tier || 'PLAIN', title: item.title })}
                            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '6px 12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                          >
                            Upgrade
                          </button>

                          <button
                            onClick={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}
                            style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}
                          >
                            ⚙️
                          </button>

                          {menuOpenId === item._id && (
                            <div style={{ position: 'absolute', right: 20, top: 46, background: '#fff', border: '1px solid #cbd5e1', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, minWidth: 140, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              
                              <button onClick={() => { handleStatusChange(item._id, 'ACTIVE'); setMenuOpenId(null); }} style={{ padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', hover: { background: '#f8fafc' } }}>
                                Set Active
                              </button>
                              
                              <button onClick={() => { handleStatusChange(item._id, 'PAUSED'); setMenuOpenId(null); }} style={{ padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer' }}>
                                Pause Listing
                              </button>
                              
                              <button onClick={() => { handleSoftDelete(item._id); setMenuOpenId(null); }} style={{ padding: '10px 14px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', color: '#dc2626' }}>
                                Archive Listing
                              </button>
                              
                            </div>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Component */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Page <span style={{ fontWeight: 700, color: '#0f172a' }}>{pagination.page}</span> of <span style={{ fontWeight: 700, color: '#0f172a' }}>{pagination.totalPages || 1}</span> ({pagination.totalCount} listings)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff', fontWeight: 600, cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff', fontWeight: 600, cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* 6. Floating Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '14px 24px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 20, zIndex: 1000, animation: 'floatUp 0.3s ease-out' }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedIds.length} listings selected</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleBulkAction('ACTIVATE')} style={{ background: '#16a34a', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Bulk Activate</button>
            <button onClick={() => handleBulkAction('PAUSE')} style={{ background: '#d97706', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Bulk Pause</button>
            <button onClick={() => handleBulkAction('ARCHIVE')} style={{ background: '#dc2626', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Bulk Archive</button>
          </div>
          <button onClick={() => setSelectedIds([])} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Clear selection</button>
        </div>
      )}

      {/* 7. Premium Tier Upgrade Modal */}
      {upgradeModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, maxWidth: 500, width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Upgrade Package Tier</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Select target promotion tier for <span style={{ fontWeight: 700, color: '#0f172a' }}>{upgradeModal.title}</span></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['PLAIN', 'BASIC', 'PLATINUM', 'PREMIUM'].map(tierName => {
                const tierCost = { PLAIN: 'Free', BASIC: '1 Credit', PLATINUM: '3 Credits', PREMIUM: '5 Credits' };
                const isCurrent = upgradeModal.currentTier === tierName;

                return (
                  <button
                    key={tierName}
                    disabled={isCurrent}
                    onClick={() => handleTierUpgrade(upgradeModal.listingId, tierName)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: 16, borderRadius: 16, border: isCurrent ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isCurrent ? '#eff6ff' : '#fff', cursor: isCurrent ? 'not-allowed' : 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{TIER_DISPLAY_NAMES[tierName]}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{tierCost[tierName]} deduction</div>
                    </div>
                    {isCurrent && <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb' }}>Current Active Tier</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setUpgradeModal({ open: false, listingId: null, currentTier: 'PLAIN', title: '' })}
              style={{ background: '#0f172a', border: 'none', color: '#fff', padding: '12px 20,px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

    </div>
  );
}
