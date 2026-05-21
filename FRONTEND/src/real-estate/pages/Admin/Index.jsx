import React, { useEffect, useState } from 'react';
import api from '../../services/api/axios';
import PropertyStatusBadge from '../../components/PropertyStatusBadge';
import { moderateProperty } from '../../services/propertiesApi';

export default function AdminIndex() {
  const [items, setItems] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const load = (currentFilter = statusFilter, currentPage = page) => {
    setLoading(true);
    api.get('/properties', { params: { status: currentFilter, page: currentPage, limit } })
      .then((res) => {
        // If server returns paginated object
        if (res.data && res.data.properties) {
          setItems(res.data.properties || []);
          setTotalPages(res.data.pages || 1);
          setTotalItems(res.data.total || 0);
        } else {
          // Fallback if server returned raw array
          setItems(res.data || []);
          setTotalPages(1);
          setTotalItems(res.data ? res.data.length : 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Reload when status filter or page changes
  useEffect(() => { 
    load(statusFilter, page); 
  }, [statusFilter, page]);

  // Reset page when status filter changes
  const handleStatusFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setPage(1);
  };

  const approve = async (id) => {
    try {
      await moderateProperty(id, { status: 'APPROVED', reviewNote: 'Approved by admin' });
      load(statusFilter, page);
    } catch (err) {
      console.error(err);
      alert('Failed to approve property');
    }
  };

  const reject = async (id) => {
    const reason = reasons[id];
    if (!reason) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await moderateProperty(id, { status: 'REJECTED', reviewNote: reason });
      // Clear rejection input
      setReasons(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      load(statusFilter, page);
    } catch (err) {
      console.error(err);
      alert('Failed to reject property');
    }
  };

  const TIER_MAP = {
    PREMIUM: { label: 'Platinum Listing', bg: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', color: '#1e293b', border: '1px solid #94a3b8' },
    PLATINUM: { label: 'Gold Listing', bg: 'linear-gradient(135deg, #fef08a 0%, #facc15 100%)', color: '#713f12', border: '1px solid #eab308' },
    BASIC: { label: 'Silver Listing', bg: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', color: '#374151', border: '1px solid #d1d5db' },
    PLAIN: { label: 'Basic Listing', bg: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }
  };

  const S = {
    font: 'Inter, sans-serif',
    card: { 
      background: '#fff', 
      borderRadius: 24, 
      border: '1px solid #e2e8f0', 
      padding: 24, 
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)', 
      display: 'grid', 
      gridTemplateColumns: '140px 1fr auto', 
      gap: 24, 
      alignItems: 'start',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    btn: (bg) => ({ 
      background: bg, 
      color: '#fff', 
      border: 'none', 
      padding: '10px 20px', 
      borderRadius: 12, 
      fontWeight: 700, 
      fontSize: 13, 
      cursor: 'pointer', 
      transition: 'opacity .15s',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }),
    tab: (active) => ({
      background: active ? '#0f172a' : '#f1f5f9',
      color: active ? '#fff' : '#64748b',
      border: 'none',
      padding: '8px 16px',
      borderRadius: 10,
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer',
      marginRight: 8,
      transition: 'all 0.2s'
    }),
    pageBtn: (active, disabled) => ({
      background: active ? '#0f172a' : '#fff',
      color: active ? '#fff' : (disabled ? '#cbd5e1' : '#475569'),
      border: '1px solid #e2e8f0',
      padding: '8px 14px',
      borderRadius: 10,
      fontWeight: 700,
      fontSize: 13,
      cursor: disabled ? 'default' : 'pointer',
      margin: '0 4px',
      transition: 'all 0.15s',
      pointerEvents: disabled ? 'none' : 'auto'
    }),
    input: { 
      background: '#f8fafc', 
      border: '1.5px solid #e2e8f0', 
      borderRadius: 12, 
      padding: '10px 14px', 
      fontSize: 13, 
      width: '100%', 
      marginBottom: 12, 
      outline: 'none', 
      color: '#0f172a', 
      fontFamily: 'Inter, sans-serif' 
    },
    kpi: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: '#f1f5f9',
      padding: '4px 10px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
      color: '#475569',
      marginRight: 10
    }
  };

  const statusOptions = [
    { label: 'All Listings', value: 'ALL' },
    { label: 'Pending Moderation', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  // Pagination indicators
  const firstItemIndex = (page - 1) * limit + 1;
  const lastItemIndex = Math.min(page * limit, totalItems);

  return (
    <section style={{ maxWidth: 1100, margin: '100px auto 100px', padding: '0 24px', fontFamily: S.font }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-.03em' }}>Property Administration</h1>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Review, analyze, and manage real estate listings</p>
        </div>
        <button onClick={() => load(statusFilter, page)} style={S.btn('#2563eb')}>Refresh Listings</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28, background: '#f8fafc', padding: 6, borderRadius: 14, border: '1px solid #e2e8f0', width: 'fit-content' }}>
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusFilterChange(opt.value)}
            style={S.tab(statusFilter === opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8', fontSize: 15, fontWeight: 500 }}>Loading listings...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 24, border: '1.5px dashed #cbd5e1' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#64748b' }}>No properties found in this tab.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {items.map((p) => {
              const img = p.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80';
              const tier = TIER_MAP[p.tier] || TIER_MAP.PLAIN;
              const leads = p.metrics?.leads || 0;
              const views = p.metrics?.views || 0;

              return (
                <article key={p._id} style={S.card}>
                  {/* Property Image */}
                  <div style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Property Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                      <PropertyStatusBadge status={p.status} />
                      <span style={{
                        background: tier.bg,
                        color: tier.color,
                        border: tier.border,
                        padding: '3px 10px',
                        borderRadius: 30,
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '.08em',
                      }}>
                        {tier.label}
                      </span>
                    </div>

                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{p.title}</h2>
                    <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>{p.locality}, {p.city}</p>
                    
                    {/* Metrics Section */}
                    <div style={{ marginBottom: 16 }}>
                      <span style={S.kpi}>
                        <i className="fa fa-envelope-o" /> {leads} {leads === 1 ? 'Lead' : 'Leads'}
                      </span>
                      <span style={S.kpi}>
                        <i className="fa fa-eye" /> {views} {views === 1 ? 'View' : 'Views'}
                      </span>
                    </div>

                    {/* Moderation section, shown only for PENDING status */}
                    {p.status === 'PENDING' && (
                      <div style={{ background: '#f8fafc', borderRadius: 16, padding: 18, border: '1px solid #e2e8f0', marginTop: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Rejection Reason (if applicable)</p>
                        <textarea 
                          placeholder="Enter reason for rejection..."
                          value={reasons[p._id] || ''}
                          onChange={(e) => setReasons({ ...reasons, [p._id]: e.target.value })}
                          style={S.input}
                          rows={2}
                        />
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button style={S.btn('#10b981')} onClick={() => approve(p._id)}>Approve Listing</button>
                          <button style={S.btn('#dc2626')} onClick={() => reject(p._id)}>Reject</button>
                        </div>
                      </div>
                    )}

                    {/* Show reviewer note if rejected */}
                    {p.status === 'REJECTED' && p.reviewNote && (
                      <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 500, border: '1px solid #fecaca', marginTop: 12 }}>
                        <strong>Rejection Note:</strong> {p.reviewNote}
                      </div>
                    )}
                  </div>

                  {/* Right Area (Price details or similar) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#2563eb' }}>
                      {p.pricing?.amount ? `₹${p.pricing.amount.toLocaleString('en-IN')}` : 'Contact Price'}
                    </div>
                    {p.filters?.intent && (
                      <span style={{
                        background: p.filters.intent === 'RENT' ? '#eff6ff' : '#f5f3ff',
                        color: p.filters.intent === 'RENT' ? '#1d4ed8' : '#6d28d9',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        For {p.filters.intent}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Premium Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginTop: 40, 
              paddingTop: 24, 
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 16
            }}>
              <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                Showing <strong style={{ color: '#0f172a' }}>{firstItemIndex}</strong> to <strong style={{ color: '#0f172a' }}>{lastItemIndex}</strong> of <strong style={{ color: '#0f172a' }}>{totalItems}</strong> listings
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  style={S.pageBtn(false, page === 1)}
                >
                  <i className="fa fa-angle-left" style={{ marginRight: 6 }} /> Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    style={S.pageBtn(page === num, false)}
                  >
                    {num}
                  </button>
                ))}

                <button 
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  style={S.pageBtn(false, page === totalPages)}
                >
                  Next <i className="fa fa-angle-right" style={{ marginLeft: 6 }} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
