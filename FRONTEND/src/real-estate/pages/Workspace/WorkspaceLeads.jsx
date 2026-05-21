import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  getOwnerLeads, 
  getOwnerLeadById, 
  updateOwnerLeadStatus, 
  getOwnerLeadsStats 
} from '../../services/leadApi';

const STATUSES = {
  NEW:            { label: 'New Lead',       bg: 'rgba(59,91,219,0.1)',   color: '#3b5bdb', border: 'rgba(59,91,219,0.2)' },
  CONTACT_VIEWED: { label: 'Contact Viewed', bg: 'rgba(240,62,94,0.08)',  color: '#f03e5e', border: 'rgba(240,62,94,0.18)' },
  ATTEMPTED_CALL: { label: 'Attempted Call', bg: 'rgba(232,137,12,0.1)',  color: '#e8890c', border: 'rgba(232,137,12,0.2)' },
  CONTACTED:      { label: 'Contacted',      bg: 'rgba(121,80,242,0.1)',  color: '#7950f2', border: 'rgba(121,80,242,0.2)' },
  FOLLOW_UP:      { label: 'Follow Up',      bg: 'rgba(32,201,151,0.1)',  color: '#0d9276', border: 'rgba(32,201,151,0.2)' },
  QUALIFIED:      { label: 'Qualified',      bg: 'rgba(13,146,118,0.1)',  color: '#0d9276', border: 'rgba(13,146,118,0.2)' },
  SITE_VISIT:     { label: 'Site Visit',     bg: 'rgba(43,138,62,0.1)',   color: '#2b8a3e', border: 'rgba(43,138,62,0.2)' },
  NEGOTIATION:    { label: 'Negotiation',    bg: 'rgba(250,162,25,0.1)',  color: '#c47011', border: 'rgba(250,162,25,0.2)' },
  CLOSED:         { label: 'Closed / Won',   bg: 'rgba(13,146,118,0.12)', color: '#0b7a62', border: 'rgba(13,146,118,0.25)' },
  LOST:           { label: 'Lost / Closed',  bg: 'rgba(240,62,94,0.1)',   color: '#c41c3a', border: 'rgba(240,62,94,0.2)' }
};

export default function WorkspaceLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [drawerLead, setDrawerLead] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [statusUpdateVal, setStatusUpdateVal] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  async function loadStats() {
    setStatsLoading(true);
    try {
      const res = await getOwnerLeadsStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error('Error loading leads stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }

  async function loadLeads() {
    setLoading(true);
    try {
      const res = await getOwnerLeads({ page, limit: 10, search: search.trim() || undefined, status: statusFilter || undefined });
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

  useEffect(() => { loadLeads(); }, [page, statusFilter]);
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); loadLeads(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => { loadStats(); }, []);

  const openLeadDrawer = (leadId) => {
    setSelectedLeadId(leadId);
    setDrawerLead(null);
    loadLeadDetail(leadId);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusUpdateVal) return;
    setSubmittingStatus(true);
    try {
      const res = await updateOwnerLeadStatus(drawerLead._id, statusUpdateVal, statusNotes);
      if (res.success) {
        await loadLeadDetail(drawerLead._id);
        await loadLeads();
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  return (
    <div className="re-fade-in">
      
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="re-eyebrow">Lead Management</div>
          <h1 className="re-page-title">Workspace Leads</h1>
          <p className="re-page-subtitle">Track, update, and close incoming property inquiries from interested buyers and tenants.</p>
        </div>
      </div>

      {/* Stats Pipeline Row */}
      <div className="re-grid-stats" style={{ marginBottom: 28 }}>
        <div className="re-stat-card" style={{ '--stat-accent': '#3b5bdb', '--stat-bg': 'rgba(59,91,219,0.1)', border: '1px solid rgba(59,91,219,0.15)' }}>
          <div className="re-stat-icon"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div className="re-stat-label">Total Leads</div>
          <div className="re-stat-value">{statsLoading ? '...' : stats?.totalLeads ?? 0}</div>
          <div className="re-stat-hint">Captured across all listings</div>
        </div>
        <div className="re-stat-card" style={{ '--stat-accent': '#7950f2', '--stat-bg': 'rgba(121,80,242,0.1)', border: '1px solid rgba(121,80,242,0.15)' }}>
          <div className="re-stat-icon"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
          <div className="re-stat-label">Active Discussions</div>
          <div className="re-stat-value">{statsLoading ? '...' : stats?.activeLeads ?? 0}</div>
          <div className="re-stat-hint">Currently in pipeline</div>
        </div>
        <div className="re-stat-card" style={{ '--stat-accent': '#0d9276', '--stat-bg': 'rgba(13,146,118,0.1)', border: '1px solid rgba(13,146,118,0.15)' }}>
          <div className="re-stat-icon"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <div className="re-stat-label">Conversions</div>
          <div className="re-stat-value">{statsLoading ? '...' : stats?.closedLeads ?? 0}</div>
          <div className="re-stat-hint">Deals closed won</div>
        </div>
        <div className="re-stat-card" style={{ '--stat-accent': '#e8890c', '--stat-bg': 'rgba(232,137,12,0.1)', border: '1px solid rgba(232,137,12,0.15)' }}>
          <div className="re-stat-icon"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></div>
          <div className="re-stat-label">Avg Interactions</div>
          <div className="re-stat-value">
            {statsLoading ? '...' : (leads.length > 0 ? (leads.reduce((acc, cur) => acc + (cur.interactionCount || 1), 0) / leads.length).toFixed(1) : '1.0')}
          </div>
          <div className="re-stat-hint">Touchpoints per lead</div>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="re-toolbar" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 300px', position: 'relative' }}>
          <label className="re-label">Search Leads</label>
          <input 
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="re-input"
            style={{ paddingLeft: 38 }}
          />
          <svg style={{ position: 'absolute', left: 12, bottom: 12, opacity: 0.4 }} width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label className="re-label">Lead Stage</label>
          <select 
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="re-select"
          >
            <option value="">All Stages</option>
            {Object.keys(STATUSES).map(key => (
              <option key={key} value={key}>{STATUSES[key].label}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => { loadLeads(); loadStats(); }} 
          className="re-btn re-btn-outline"
          style={{ alignSelf: 'flex-end', height: 43 }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{marginRight: 6}}><polyline points="23 4 23 10 17 10"/><path strokeLinecap="round" strokeLinejoin="round" d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Leads Table Container */}
      <div className="re-panel">
        {loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="re-spinner re-spinner-dark" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#9fa6b8', fontSize: 14, fontWeight: 600 }}>Fetching Lead Pipeline...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="re-empty">
            <div className="re-empty-icon" style={{color:'#9fa6b8'}}><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0f1629', margin: '0 0 8px' }}>No Leads Captured</h4>
            <p style={{ fontSize: 14, color: '#9fa6b8', margin: 0 }}>There are no contact unlocks matching your filter criteria.</p>
          </div>
        ) : (
          <div className="re-table-wrap">
            <table className="re-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 24 }}>Lead User</th>
                  <th>Contact Details</th>
                  <th>Target Listing</th>
                  <th>Source</th>
                  <th>Stage</th>
                  <th>Interactions</th>
                  <th style={{ paddingRight: 24, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => {
                  const statusConf = STATUSES[lead.status?.toUpperCase()] || STATUSES.NEW;
                  return (
                    <tr key={lead._id} onClick={() => openLeadDrawer(lead._id)} style={{ cursor: 'pointer' }}>
                      <td style={{ paddingLeft: 24, fontWeight: 800, color: '#0f1629' }}>
                        {lead.viewerName || lead.name || 'Anonymous User'}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#303860' }}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {lead.viewerPhone || lead.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9fa6b8', marginTop: 3 }}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          {lead.viewerEmail || lead.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#3b5bdb', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lead.propertyId?.title || 'Listing Details'}
                        </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9fa6b8', marginTop: 3 }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {[lead.propertyId?.locality, lead.propertyId?.city].filter(Boolean).join(', ') || 'Prime Locality'}
                          </div>
                      </td>
                      <td>
                        <span style={{ background: '#f1f3f9', color: '#4b5575', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e6f0', textTransform: 'capitalize' }}>
                          {lead.source?.replace(/_/g, ' ') || 'Direct Unlock'}
                        </span>
                      </td>
                      <td>
                        <span style={{ background: statusConf.bg, color: statusConf.color, border: `1px solid ${statusConf.border}`, fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 100, display: 'inline-block' }}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#0f1629' }}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                          {lead.interactionCount || 1} times
                        </div>
                        <div style={{ fontSize: 11, color: '#9fa6b8', marginTop: 3 }}>Last: {new Date(lead.lastInteractionAt || lead.updatedAt).toLocaleDateString()}</div>
                      </td>
                      <td style={{ paddingRight: 24, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button onClick={() => openLeadDrawer(lead._id)} className="re-btn re-btn-outline re-btn-sm" style={{ padding: '6px 12px' }}>
                            Edit
                          </button>
                          <a href={`tel:${lead.viewerPhone || lead.phone}`} className="re-btn re-btn-primary re-btn-sm" style={{ padding: '6px 12px', borderRadius: 8 }}>
                            Call
                          </a>
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
        {leads.length > 0 && (
          <div className="re-pagination">
            <span className="re-pagination-info">
              Showing {leads.length} of {totalLeads} captured leads
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="re-pagi-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Previous</button>
              <button className="re-pagi-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Out Details Drawer Overlay */}
      {selectedLeadId && createPortal(
        <div className="re-drawer-overlay" onClick={() => setSelectedLeadId(null)}>
          <div className="re-drawer" onClick={e => e.stopPropagation()}>
            <div className="re-drawer-header">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-.02em' }}>Lead Details Pipeline</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0, fontWeight: 500 }}>Audit details, stages, and customer notes.</p>
              </div>
              <button onClick={() => setSelectedLeadId(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 34, height: 34, borderRadius: '50%', color: '#fff', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>

            <div className="re-drawer-body">
              {drawerLoading || !drawerLead ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <div className="re-spinner re-spinner-dark" style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontSize: 13, color: '#9fa6b8', fontWeight: 600 }}>Loading timeline details...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Summary Card */}
                  <div style={{ background: '#f8f9fc', border: '1px solid #e2e6f0', borderRadius: 18, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: 18, fontWeight: 900, color: '#0f1629', margin: 0 }}>{drawerLead.viewerName}</h4>
                      <span style={{
                        background: (STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).bg,
                        color: (STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).color,
                        border: `1px solid ${(STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).border}`,
                        fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 100
                      }}>{(STATUSES[drawerLead.status?.toUpperCase()] || STATUSES.NEW).label}</span>
                    </div>

                    <div style={{ fontSize: 13.5, color: '#4b5575', margin: '0 0 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <strong>Mobile:</strong> {drawerLead.viewerPhone}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#4b5575', margin: '0 0 16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <strong>Email:</strong> {drawerLead.viewerEmail}
                    </div>

                    <div style={{ borderTop: '1px solid #e2e6f0', paddingTop: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#9fa6b8', margin: '0 0 6px', letterSpacing: '0.1em' }}>Target Property Listing</p>
                      <h5 style={{ fontSize: 14, fontWeight: 800, color: '#3b5bdb', margin: '0 0 4px' }}>{drawerLead.propertyId?.title}</h5>
                      <p style={{ fontSize: 12, color: '#6b7494', margin: 0, fontWeight: 500 }}>Locality: {drawerLead.propertyId?.locality}, {drawerLead.propertyId?.city}</p>
                    </div>
                  </div>

                  {/* Status update form */}
                  <form onSubmit={handleStatusUpdate} style={{ background: '#fff', border: '1px solid #e2e6f0', borderRadius: 18, padding: 20 }}>
                    <h5 style={{ fontSize: 13, fontWeight: 900, color: '#0f1629', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Update Pipeline Stage</h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label className="re-label">Lead Status</label>
                        <select value={statusUpdateVal} onChange={e => setStatusUpdateVal(e.target.value)} className="re-select" required>
                          {Object.keys(STATUSES).map(key => (
                            <option key={key} value={key}>{STATUSES[key].label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="re-label">Interaction Notes</label>
                        <textarea 
                          placeholder="e.g. Called lead, scheduled virtual site tour."
                          value={statusNotes}
                          onChange={e => setStatusNotes(e.target.value)}
                          className="re-input"
                          style={{ height: 80, resize: 'none' }}
                        />
                      </div>

                      <button type="submit" disabled={submittingStatus} className="re-btn re-btn-primary re-btn-full" style={{ borderRadius: 12 }}>
                        {submittingStatus ? 'Updating...' : 'Submit Update'}
                      </button>
                    </div>
                  </form>

                  {/* Timeline */}
                  <div>
                    <h5 style={{ fontSize: 13, fontWeight: 900, color: '#0f1629', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Interaction History</h5>
                    <div className="re-timeline">
                      {drawerLead.activities && drawerLead.activities.length > 0 ? (
                        drawerLead.activities.slice().reverse().map((act, index) => (
                          <div key={index} className="re-timeline-item">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className="re-timeline-dot">{drawerLead.activities.length - index}</div>
                              {index < drawerLead.activities.length - 1 && <div className="re-timeline-connector" style={{ flex: 1 }} />}
                            </div>
                            <div style={{ paddingBottom: index < drawerLead.activities.length - 1 ? 20 : 0 }}>
                              <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f1629', margin: '0 0 4px', lineHeight: 1.5 }}>{act.message}</p>
                              <span style={{ fontSize: 11.5, color: '#9fa6b8', fontWeight: 500 }}>
                                {new Date(act.createdAt).toLocaleString()} • Action by {act.byUser?.name || 'Owner'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: 13, color: '#9fa6b8', margin: 0, fontWeight: 500 }}>No interaction logs recorded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
