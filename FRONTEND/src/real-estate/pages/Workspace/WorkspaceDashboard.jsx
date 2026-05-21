import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkspaceOverview } from '../../services/sellerWorkspaceApi';
import ChartCard from '../../components/ui/ChartCard';
import DataTable from '../../components/ui/DataTable';

const METRIC_CONFIG = [
  { key: 'propertyCount',       label: 'Total Properties', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, accent: '#3b5bdb', bg: 'rgba(59,91,219,0.1)',  border: 'rgba(59,91,219,0.15)',  hint: 'All properties in your account' },
  { key: 'activePropertyCount', label: 'Active Listings',  icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>, accent: '#0d9276', bg: 'rgba(13,146,118,0.1)', border: 'rgba(13,146,118,0.15)', hint: 'Approved & pending in circulation' },
  { key: 'leadCount',           label: 'Total Leads',      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, accent: '#e8890c', bg: 'rgba(232,137,12,0.1)', border: 'rgba(232,137,12,0.15)', hint: 'Leads tied to your inventory' },
  { key: 'auditCount',          label: 'Audit Trail',      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, accent: '#7950f2', bg: 'rgba(121,80,242,0.1)', border: 'rgba(121,80,242,0.15)', hint: 'Logged sensitive workspace actions' },
];

const STATUS_ITEMS = [
  { label: 'Auth', statusKey: 'auth', default: 'ready' },
  { label: 'Billing', statusKey: 'billing', default: 'ready-for-integration' },
  { label: 'Notifications', statusKey: 'notifications', default: 'event-ready' },
  { label: 'Tenant', statusKey: 'tenant', default: 'poster-owned' },
];

function ModuleCard({ module, isAvailable }) {
  return (
    <div style={{
      background: '#fff',
      border: isAvailable ? '1.5px solid rgba(59,91,219,0.18)' : '1px solid rgba(226,230,240,0.8)',
      borderRadius: 18,
      padding: 22,
      display: 'flex', flexDirection: 'column', gap: 12,
      minHeight: 170,
      transition: 'box-shadow 0.25s ease, transform 0.25s ease',
      boxShadow: '0 4px 16px rgba(15,22,50,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(15,22,50,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,22,50,0.05)'; e.currentTarget.style.transform = 'none'; }}
    >
      {isAvailable && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #3b5bdb, #748ffc)',
          borderRadius: '18px 18px 0 0',
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: isAvailable ? 6 : 0 }}>
        <strong style={{ fontSize: 14.5, color: '#0f1629', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {module.label}
        </strong>
        <span style={{
          fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 100,
          background: isAvailable ? 'rgba(13,146,118,0.1)' : 'rgba(226,230,240,0.6)',
          color: isAvailable ? '#0d9276' : '#6b7494',
          border: isAvailable ? '1px solid rgba(13,146,118,0.2)' : '1px solid rgba(226,230,240,0.8)',
          textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
        }}>
          {isAvailable ? '● Active' : 'Coming Soon'}
        </span>
      </div>
      <div style={{ fontSize: 13, color: '#9fa6b8', lineHeight: 1.7, flex: 1 }}>
        {isAvailable
          ? 'Connected to the workspace shell and ready for scoped data, permissions, and actions.'
          : 'Planned in the roadmap. The route shell and access rules are already reserved.'}
      </div>
      <Link to={isAvailable ? module.route : '/real-estate/workspace'} style={{
        fontSize: 13, fontWeight: 800,
        color: isAvailable ? '#3b5bdb' : '#9fa6b8',
        textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        transition: 'gap 0.18s ease',
      }}
        onMouseOver={e => e.currentTarget.style.gap = '8px'}
        onMouseOut={e => e.currentTarget.style.gap = '5px'}
      >
        {isAvailable ? 'Open module' : 'View roadmap'} →
      </Link>
    </div>
  );
}

export default function WorkspaceDashboard() {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let alive = true;
    fetchWorkspaceOverview()
      .then(data => { if (alive) setState({ loading: false, error: '', data }); })
      .catch(error => { if (alive) setState({ loading: false, error: error?.response?.data?.message || error.message || 'Failed to load workspace', data: null }); });
    return () => { alive = false; };
  }, []);

  const data = state.data || {};
  const summary = data.summary || {};
  const modules = data.modules || [];

  const moduleRows = useMemo(() => modules.slice(0, 6).map(module => ({
    ...module,
    available: ['workspace-overview', 'properties'].includes(module.key),
  })), [modules]);

  if (state.loading) {
    return (
      <div className="re-fade-in">
        <div className="re-grid-stats" style={{ marginBottom: 24 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="re-skeleton" style={{ height: 110, borderRadius: 18 }} />
          ))}
        </div>
        <div className="re-skeleton" style={{ height: 200, borderRadius: 18, marginBottom: 24 }} />
        <div className="re-grid-3">
          {[1,2,3].map(i => <div key={i} className="re-skeleton" style={{ height: 170, borderRadius: 18 }} />)}
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(240,62,94,0.2)', color: '#f03e5e', borderRadius: 16, padding: 20 }}>
        {state.error}
      </div>
    );
  }

  return (
    <div className="re-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div className="re-eyebrow">Seller / Dealer Control Panel</div>
        <h1 className="re-page-title">Workspace Overview</h1>
        <p className="re-page-subtitle" style={{ maxWidth: 680 }}>
          A modular, tenant-ready workspace for managing properties, leads, plans, billing, and team access within Doltec Estates.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="re-grid-stats" style={{ marginBottom: 24 }}>
        {METRIC_CONFIG.map(m => (
          <div key={m.key} className="re-stat-card" style={{
            '--stat-accent': m.accent,
            '--stat-bg': m.bg,
            border: `1px solid ${m.border}`,
          }}>
            <div className="re-stat-icon">{m.icon}</div>
            <div className="re-stat-label">{m.label}</div>
            <div className="re-stat-value">{summary[m.key] ?? 0}</div>
            <div className="re-stat-hint">{m.hint}</div>
          </div>
        ))}
      </div>

      {/* Status + CTA Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 24 }} className="ws-status-grid">
        {/* Status Card */}
        <ChartCard
          title="Workspace Status"
          subtitle="Backend rollout snapshot — billing, auth, and data layer readiness."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {STATUS_ITEMS.map(({ label, statusKey, default: def }) => {
              const val = statusKey === 'tenant' ? data.tenant?.strategy || def : data.status?.[statusKey] || def;
              return (
                <div key={label} style={{
                  border: '1px solid rgba(226,230,240,0.8)',
                  borderRadius: 14, padding: '14px 16px',
                  background: 'rgba(248,249,252,0.7)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9fa6b8', marginBottom: 6 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f1629' }}>
                    {String(val)}
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Next Step CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #0b0f1a 0%, #1a2550 100%)',
          color: '#fff', borderRadius: 20, padding: 24,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16,
          boxShadow: '0 12px 40px rgba(11,15,26,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(59,91,219,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(186,200,255,0.7)', marginBottom: 10 }}>
              Next Build Step
            </div>
            <h2 style={{ margin: '0 0 10px', fontSize: 19, lineHeight: 1.2, letterSpacing: '-0.03em', fontWeight: 900 }}>
              Implement the Properties module
            </h2>
            <p style={{ margin: 0, color: 'rgba(186,200,255,0.65)', fontSize: 13.5, lineHeight: 1.65 }}>
              The shell, permissions, and overview API are ready. Next modules plug in without changing the app entrypoint.
            </p>
          </div>
          <Link to="/real-estate/workspace/listings/all" style={{
            display: 'inline-flex', alignSelf: 'flex-start', textDecoration: 'none',
            color: '#0f1629', background: 'linear-gradient(135deg, #faa219, #e8890c)',
            fontSize: 13, fontWeight: 800, padding: '10px 18px', borderRadius: 12,
            boxShadow: '0 4px 14px rgba(234,137,12,0.35)',
          }}>
            Open Properties →
          </Link>
        </div>
      </div>

      {/* Modules Grid */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px', color: '#0f1629', letterSpacing: '-0.03em' }}>
              Workspace Modules
            </h2>
            <p style={{ margin: 0, color: '#9fa6b8', fontSize: 13, fontWeight: 500 }}>
              Defined centrally — implement one module at a time without touching the app shell.
            </p>
          </div>
          <div style={{
            fontSize: 12, color: '#9fa6b8', fontWeight: 700,
            background: 'rgba(226,230,240,0.5)',
            padding: '5px 12px', borderRadius: 8,
            border: '1px solid rgba(226,230,240,0.8)',
          }}>
            Actor: {data.tenant?.actorId || 'unknown'}
          </div>
        </div>

        <div className="re-grid-3" style={{ marginBottom: 24 }}>
          {modules.map(module => (
            <ModuleCard
              key={module.key}
              module={module}
              isAvailable={module.key === 'workspace-overview' || module.key === 'properties'}
            />
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={[
          { key: 'label',  label: 'Module' },
          { key: 'route',  label: 'Route' },
          { key: 'roles',  label: 'Roles', render: (row) => row.roles?.join(', ') || 'All' },
          { key: 'availability', label: 'Status', render: (row) => (
            <span style={{
              padding: '4px 10px', borderRadius: 100,
              background: row.available ? 'rgba(13,146,118,0.1)' : 'rgba(226,230,240,0.6)',
              color: row.available ? '#0d9276' : '#6b7494',
              fontSize: 11, fontWeight: 800,
              border: row.available ? '1px solid rgba(13,146,118,0.2)' : '1px solid rgba(226,230,240,0.8)',
            }}>
              {row.available ? 'Available' : 'Planned'}
            </span>
          ) },
        ]}
        rows={moduleRows}
        emptyState="No modules available yet."
        rowKey="key"
      />

      <style>{`
        @media (max-width: 1100px) { .ws-status-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) { .re-grid-stats { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 500px) { .re-grid-stats { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}