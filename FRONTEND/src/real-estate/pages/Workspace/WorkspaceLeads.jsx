import React, { useEffect, useState } from 'react';
import { 
  getOwnerLeads, 
  getOwnerLeadById, 
  updateOwnerLeadStatus, 
  getOwnerLeadsStats 
} from '../../services/leadApi';

// Status labels and styling colors
const STATUSES = {
  NEW: { label: 'New Lead', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  CONTACT_VIEWED: { label: 'Contact Viewed', bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' },
  ATTEMPTED_CALL: { label: 'Attempted Call', bg: '#fff7ed', color: '#ea580c', border: '#ffedd5' },
  CONTACTED: { label: 'Contacted', bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
  FOLLOW_UP: { label: 'Follow Up', bg: '#f0fdfa', color: '#0d9488', border: '#ccfbf1' },
  QUALIFIED: { label: 'Qualified', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  SITE_VISIT: { label: 'Site Visit', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  NEGOTIATION: { label: 'Negotiation', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  CLOSED: { label: 'Closed / Won', bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0' },
  LOST: { label: 'Lost / Closed', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
};

export default function WorkspaceLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Table search and filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Lead details drawer state
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [drawerLead, setDrawerLead] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [statusUpdateVal, setStatusUpdateVal] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Fetch Dashboard Stats
  async function loadStats() {
    setStatsLoading(true);
    try {
      const res = await getOwnerLeadsStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error loading leads stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }

  // Fetch paginated and filtered Leads
  async function loadLeads() {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter || undefined
      };
      const res = await getOwnerLeads(params);
      if (res.success) {
        setLeads(res.data);
        setTotalPages(res.pagination.pages);
        setTotalLeads(res.pagination.total);
      }
    } catch (err) {
      console.error('Error loading owner leads:', err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch single lead for details drawer
  async function loadLeadDetail(leadId) {
    setDrawerLoading(true);
    try {
      const res = await getOwnerLeadById(leadId);
      if (res.success) {
        setDrawerLead(res.data);
        setStatusUpdateVal(res.data.status);
        setStatusNotes('');
      }
    } catch (err) {
      console.error('Error loading lead details:', err);
    } finally {
      setDrawerLoading(false);
    }
  }

  // Effect to load leads when filter/page changes
  useEffect(() => {
    loadLeads();
  }, [page, statusFilter]);

  // Effect to run search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadLeads();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load stats and leads on mount
  useEffect(() => {
    loadStats();
  }, []);

  // Handle drawer click
  const openLeadDrawer = (leadId) => {
    setSelectedLeadId(leadId);
    setDrawerLead(null);
    loadLeadDetail(leadId);
  };

  // Submit Lead Status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusUpdateVal) return;
    setSubmittingStatus(true);
    try {
      const res = await updateOwnerLeadStatus(drawerLead._id, statusUpdateVal, statusNotes);
      if (res.success) {
        // reload drawer details
        await loadLeadDetail(drawerLead._id);
        // reload list
        await loadLeads();
        // reload stats
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a', padding: '10px 0 60px' }}>
      
      {/* Stats Pipeline Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        
        {/* Total leads card */}
        <div style={statsCardStyle('#2563eb')}>
          <div>
            <p style={statsTitleStyle}>Total Leads captured</p>
            <h3 style={statsValueStyle}>{statsLoading ? '...' : stats?.totalLeads ?? 0}</h3>
          </div>
          <span style={statsIconStyle('rgba(37,99,235,0.1)', '#2563eb')}>👥</span>
        </div>

        {/* Active leads card */}
        <div style={statsCardStyle('#7c3aed')}>
          <div>
            <p style={statsTitleStyle}>Active Discussions</p>
            <h3 style={statsValueStyle}>{statsLoading ? '...' : stats?.activeLeads ?? 0}</h3>
          </div>
          <span style={statsIconStyle('rgba(124,58,237,0.1)', '#7c3aed')}>⚡</span>
        </div>

        {/* Closed leads card */}
        <div style={statsCardStyle('#10b981')}>
          <div>
            <p style={statsTitleStyle}>Conversions / Deals</p>
            <h3 style={statsValueStyle}>{statsLoading ? '...' : stats?.closedLeads ?? 0}</h3>
          </div>
          <span style={statsIconStyle('rgba(16,185,129,0.1)', '#10b981')}>🎉</span>
        </div>

        {/* Action Reveal conversion rate */}
        <div style={statsCardStyle('#ea580c')}>
          <div>
            <p style={statsTitleStyle}>Avg Interactions</p>
            <h3 style={statsValueStyle}>
              {statsLoading ? '...' : (leads.length > 0 ? (leads.reduce((acc, cur) => acc + (cur.interactionCount || 1), 0) / leads.length).toFixed(1) : '1.0')}
            </h3>
          </div>
          <span style={statsIconStyle('rgba(234,88,12,0.1)', '#ea580c')}>🔄</span>
        </div>

      </div>

      {/* Filter and Search Bar Container */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18,
        padding: '18px 24px', marginBottom: 24, display: 'flex', gap: 16,
        alignItems: 'center', flexWrap: 'wrap'
      }}>
        
        {/* Text Search */}
        <div style={{ flex: '2 1 300px', position: 'relative' }}>
          <input 
            type="text"
            placeholder="Search leads by viewer name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={filterInputStyle}
          />
          <span style={{ position: 'absolute', right: 14, top: 12, color: '#94a3b8' }}>🔍</span>
        </div>

        {/* Status Dropdown */}
        <div style={{ flex: '1 1 200px' }}>
          <select 
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={filterInputStyle}
          >
            <option value="">All Lead Stages</option>
            {Object.keys(STATUSES).map(key => (
              <option key={key} value={key}>{STATUSES[key].label}</option>
            ))}
          </select>
        </div>

        {/* Refresh button */}
        <button 
          onClick={() => { loadLeads(); loadStats(); }} 
          style={{
            background: '#f1f5f9', border: 'none', padding: '12px 18px', borderRadius: 12,
            fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background .15s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
          onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
        >
          🔄 Refresh
        </button>

      </div>

      {/* Leads Table Container */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontWeight: 600, fontSize: 14 }}>Fetching Lead Pipeline details...</p>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '80px 24px', textAlign: 'center', color: '#64748b' }}>
            <span style={{ fontSize: 32 }}>📁</span>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '12px 0 4px' }}>No Leads Captured</h4>
            <p style={{ fontSize: 13, margin: 0 }}>There are no contact unlocks matching your filter criteria on your listings.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ ...thStyle, paddingLeft: 24 }}>Lead User</th>
                  <th style={thStyle}>Contact Details</th>
                  <th style={thStyle}>Target Listing</th>
                  <th style={thStyle}>Channel / Source</th>
                  <th style={thStyle}>Status / Stage</th>
                  <th style={thStyle}>Interactions</th>
                  <th style={{ ...thStyle, paddingRight: 24, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => {
                  const statusConf = STATUSES[lead.status?.toUpperCase()] || STATUSES.NEW;
                  return (
                    <tr 
                      key={lead._id} 
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background .15s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => openLeadDrawer(lead._id)}
                    >
                      {/* Name */}
                      <td style={{ ...tdStyle, paddingLeft: 24, fontWeight: 800, color: '#0f172a' }}>
                        {lead.viewerName || lead.name || 'Anonymous User'}
                      </td>

                      {/* Contact */}
                      <td style={tdStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ fontWeight: 600, color: '#334155' }}>📞 {lead.viewerPhone || lead.phone}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>✉ {lead.viewerEmail || lead.email}</div>
                      </td>

                      {/* Property */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 700, color: '#2563eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                          {lead.propertyId?.title || 'Listing Details'}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          📍 {[lead.propertyId?.locality, lead.propertyId?.city].filter(Boolean).join(', ') || 'Prime Locality'}
                        </div>
                      </td>

                      {/* Source */}
                      <td style={tdStyle}>
                        <span style={{
                          background: '#f1f5f9', color: '#475569', fontSize: 11, fontWeight: 700,
                          padding: '3px 8px', borderRadius: 6, border: '1px solid #e2e8f0', textTransform: 'capitalize'
                        }}>
                          {lead.source?.replace(/_/g, ' ') || 'Direct Unlock'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span style={{
                          background: statusConf.bg, color: statusConf.color, border: `1px solid ${statusConf.border}`,
                          fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 30, display: 'inline-block'
                        }}>
                          {statusConf.label}
                        </span>
                      </td>

                      {/* Interaction Count */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          ⚡ {lead.interactionCount || 1} times
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                          Last: {new Date(lead.lastInteractionAt || lead.updatedAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ ...tdStyle, paddingRight: 24, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => openLeadDrawer(lead._id)}
                            style={tblActionBtnStyle('#f1f5f9', '#475569')}
                          >📁 Edit</button>
                          <a 
                            href={`tel:${lead.viewerPhone || lead.phone}`} 
                            style={tblActionBtnStyle('#eff6ff', '#2563eb', 'inline-block')}
                          >📞 Call</a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {leads.length > 0 && (
          <div style={{
            background: '#f8fafc', padding: '16px 24px', borderTop: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <p style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
              Showing {leads.length} of {totalLeads} captured leads
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                style={pagiBtnStyle(page <= 1)}
              >Previous</button>
              <button 
                disabled={page >= totalPages} 
                onClick={() => setPage(p => p + 1)}
                style={pagiBtnStyle(page >= totalPages)}
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Out Details Drawer Overlay */}
      {selectedLeadId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', justifyContent: 'flex-end',
          animation: 're-fade-in .2s ease-out'
        }}
          onClick={() => setSelectedLeadId(null)}
        >
          {/* Drawer Panel */}
          <div style={{
            background: '#fff', width: '100%', maxWidth: 500, height: '100%',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.12)', borderLeft: '1px solid #e2e8f0',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 're-drawer-slide .3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              padding: '24px 28px', color: '#fff', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-.02em' }}>Lead Details Pipeline</h3>
                <p style={{ color: '#93c5fd', fontSize: 12.5, margin: 0, fontWeight: 500 }}>Audit details, stages, and customer notes.</p>
              </div>
              <button 
                onClick={() => setSelectedLeadId(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none', width: 34, height: 34,
                  borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >✕</button>
            </div>

            {/* Drawer Body Scroll */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {drawerLoading || !drawerLead ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ width: 28, height: 28, border: '2.5px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Loading timeline details...</p>
                </div>
              ) : (
                <>
                  {/* Lead Summary Card */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>{drawerLead.viewerName}</h4>
                      <span style={{
                        background: (STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).bg,
                        color: (STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).color,
                        fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 20
                      }}>{(STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).label}</span>
                    </div>

                    <p style={{ fontSize: 13, color: '#475569', margin: '0 0 6px' }}><strong>📞 Mobile:</strong> {drawerLead.viewerPhone}</p>
                    <p style={{ fontSize: 13, color: '#475569', margin: '0 0 14px' }}><strong>✉ Email:</strong> {drawerLead.viewerEmail}</p>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px' }}>Target Property Listing</p>
                      <h5 style={{ fontSize: 13.5, fontWeight: 800, color: '#2563eb', margin: 0 }}>{drawerLead.propertyId?.title}</h5>
                      <p style={{ fontSize: 11.5, color: '#64748b', margin: '2px 0 0' }}>Locality: {drawerLead.propertyId?.locality}, {drawerLead.propertyId?.city}</p>
                    </div>
                  </div>

                  {/* Status update form */}
                  <form onSubmit={handleStatusUpdate} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 18 }}>
                    <h5 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Update pipeline Stage</h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Lead Status</label>
                        <select 
                          value={statusUpdateVal}
                          onChange={e => setStatusUpdateVal(e.target.value)}
                          style={filterInputStyle}
                          required
                        >
                          {Object.keys(STATUSES).map(key => (
                            <option key={key} value={key}>{STATUSES[key].label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Interaction Notes / Comments</label>
                        <textarea 
                          placeholder="e.g. Called lead, scheduled virtual site tour on Saturday."
                          value={statusNotes}
                          onChange={e => setStatusNotes(e.target.value)}
                          style={{
                            ...filterInputStyle, height: 70, resize: 'none', padding: '10px 12px',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={submittingStatus}
                        style={{
                          background: submittingStatus ? '#93c5fd' : '#2563eb', color: '#fff',
                          border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700,
                          fontSize: 13, cursor: submittingStatus ? 'wait' : 'pointer', transition: 'background .15s'
                        }}
                      >
                        {submittingStatus ? 'Updating stage...' : 'Submit pipeline update'}
                      </button>
                    </div>
                  </form>

                  {/* Activity Log / Timeline */}
                  <div>
                    <h5 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '.04em' }}>Interaction History</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {drawerLead.activities && drawerLead.activities.length > 0 ? (
                        drawerLead.activities.slice().reverse().map((act, index) => (
                          <div key={index} style={{ display: 'flex', gap: 12 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{
                                width: 22, height: 22, borderRadius: '50%', background: '#eff6ff', border: '1.5px solid #2563eb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#2563eb', fontWeight: 'bold'
                              }}>
                                {drawerLead.activities.length - index}
                              </div>
                              {index < drawerLead.activities.length - 1 && (
                                <div style={{ flex: 1, width: 1.5, background: '#e2e8f0', margin: '6px 0' }} />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, fontWeight: 700, color: '#334155', margin: 0 }}>{act.message}</p>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                {new Date(act.createdAt).toLocaleString()} • Action by {act.byUser?.name || 'Owner'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: 12.5, color: '#94a3b8', margin: 0 }}>No interaction logs recorded.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global CSS spinner injection */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes re-drawer-slide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// Inline Styles
const statsCardStyle = (borderColor) => ({
  background: '#fff', border: '1px solid #e2e8f0', borderLeft: `5px solid ${borderColor}`,
  borderRadius: 18, padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', boxShadow: '0 4px 12px rgba(15,23,42,0.015)'
});

const statsTitleStyle = {
  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em',
  color: '#64748b', margin: '0 0 4px'
};

const statsValueStyle = {
  fontSize: 28, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-.03em'
};

const statsIconStyle = (bgColor, color) => ({
  width: 44, height: 44, borderRadius: '50%', background: bgColor,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 18, color
});

const filterInputStyle = {
  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
  borderRadius: 12, padding: '11px 14px', fontSize: 13, fontWeight: 600,
  color: '#0f172a', outline: 'none', boxSizing: 'border-box'
};

const thStyle = {
  padding: '16px 14px', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '.08em', color: '#475569', borderBottom: '1px solid #e2e8f0'
};

const tdStyle = {
  padding: '16px 14px', verticalAlign: 'middle'
};

const tblActionBtnStyle = (bg, color, display = 'flex') => ({
  background: bg, color, border: 'none', padding: '6px 12px', borderRadius: 8,
  fontSize: 11.5, fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
  display, alignItems: 'center', justifyContent: 'center', transition: 'all .15s'
});

const pagiBtnStyle = (disabled) => ({
  background: disabled ? '#f1f5f9' : '#fff',
  color: disabled ? '#94a3b8' : '#334155',
  border: '1px solid #e2e8f0',
  padding: '8px 16px', borderRadius: 10, fontSize: 12.5, fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all .15s'
});
