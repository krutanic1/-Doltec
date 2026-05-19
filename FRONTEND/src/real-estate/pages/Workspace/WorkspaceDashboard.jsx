import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorkspaceOverview } from '../../services/sellerWorkspaceApi';
import ChartCard from '../../components/ui/ChartCard';
import DataTable from '../../components/ui/DataTable';

const shell = {
  maxWidth: 1320,
  margin: '0 auto',
  padding: '16px 0 48px',
};

function MetricCard({ label, value, hint, tone = 'blue' }) {
  const tones = {
    blue: { accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    green: { accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    amber: { accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    violet: { accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  };

  const color = tones[tone] || tones.blue;

  return (
    <div style={{ background: '#fff', border: `1px solid ${color.border}`, borderRadius: 20, padding: 20, boxShadow: '0 10px 30px rgba(15,23,42,.04)' }}>
      <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-.04em', color: color.accent, marginTop: 10 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 8, lineHeight: 1.6 }}>{hint}</div>
    </div>
  );
}

function ModuleCard({ module, isAvailable }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 170 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <strong style={{ fontSize: 15, color: '#0f172a' }}>{module.label}</strong>
        <span style={{ fontSize: 11, fontWeight: 900, padding: '5px 8px', borderRadius: 999, background: isAvailable ? '#dcfce7' : '#f1f5f9', color: isAvailable ? '#166534' : '#475569' }}>
          {isAvailable ? 'Available' : 'Coming soon'}
        </span>
      </div>
      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
        {isAvailable
          ? 'Connected to the workspace shell and ready for scoped data, permissions, and actions.'
          : 'Planned in the phase-5 roadmap. The route shell and access rules are already reserved.'}
      </div>
      <Link to={isAvailable ? module.route : '/real-estate/workspace'} style={{ color: '#2563eb', fontSize: 13, fontWeight: 800, textDecoration: 'none', marginTop: 'auto' }}>
        {isAvailable ? 'Open module' : 'View roadmap'}
      </Link>
    </div>
  );
}

export default function WorkspaceDashboard() {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let alive = true;

    fetchWorkspaceOverview()
      .then((data) => {
        if (alive) setState({ loading: false, error: '', data });
      })
      .catch((error) => {
        if (alive) setState({ loading: false, error: error?.response?.data?.message || error.message || 'Failed to load workspace', data: null });
      });

    return () => {
      alive = false;
    };
  }, []);

  const data = state.data || {};
  const summary = data.summary || {};
  const modules = data.modules || [];

  const moduleRows = useMemo(() => modules.slice(0, 6).map((module) => ({
    ...module,
    available: ['workspace-overview', 'properties'].includes(module.key),
  })), [modules]);

  if (state.loading) {
    return (
      <div style={shell}>
        <div style={{ height: 120, borderRadius: 24, background: 'linear-gradient(90deg, #e2e8f0, #f8fafc, #e2e8f0)', backgroundSize: '200% 100%', animation: 'workspace-shimmer 1.2s ease-in-out infinite' }} />
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={shell}>
        <div style={{ background: '#fff', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 18, padding: 20 }}>{state.error}</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)', minHeight: '100vh' }}>
      <div style={shell}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.18em' }}>Seller / Dealer Control Panel</div>
          <h1 style={{ fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.02, margin: '10px 0 8px', color: '#0f172a', letterSpacing: '-.05em' }}>Workspace Overview</h1>
          <p style={{ margin: 0, color: '#475569', fontSize: 15, maxWidth: 760, lineHeight: 1.7 }}>
            A modular, tenant-ready workspace for managing properties, leads, plans, billing, and team access within Doltec Real Estate.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 16 }} className="workspace-grid">
          <MetricCard label="Properties" value={summary.propertyCount ?? 0} hint="All properties owned by the current account." tone="blue" />
          <MetricCard label="Active" value={summary.activePropertyCount ?? 0} hint="Approved or pending listings in circulation." tone="green" />
          <MetricCard label="Leads" value={summary.leadCount ?? 0} hint="Leads tied to your property inventory." tone="amber" />
          <MetricCard label="Audit Trail" value={summary.auditCount ?? 0} hint="Logged sensitive actions by the workspace owner." tone="violet" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 16, marginBottom: 20 }} className="workspace-status-grid">
          <div style={{ gridColumn: 'span 8' }} className="workspace-status-col">
            <ChartCard title="Workspace status" subtitle="The backend already exposes the rollout snapshot for billing, auth, and data layer readiness." >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                {[
                  ['Auth', data.status?.auth || 'ready'],
                  ['Billing', data.status?.billing || 'ready-for-integration'],
                  ['Notifications', data.status?.notifications || 'event-ready'],
                  ['Tenant scope', data.tenant?.strategy || 'poster-owned'],
                ].map(([label, value]) => (
                  <div key={label} style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 14, background: '#f8fafc' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', color: '#64748b' }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>{String(value)}</div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          <div style={{ gridColumn: 'span 4', background: '#0f172a', color: '#fff', borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }} className="workspace-action-col">
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.16em', color: '#94a3b8' }}>Next build step</div>
              <h2 style={{ margin: '12px 0 10px', fontSize: 24, lineHeight: 1.1 }}>Implement the properties module next</h2>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>
                The shell, permissions, and overview API are ready. Next modules can plug in without changing the app entrypoint.
              </p>
            </div>
            <Link to="/real-estate/workspace/properties" style={{ display: 'inline-flex', alignSelf: 'flex-start', textDecoration: 'none', color: '#0f172a', background: '#f8fafc', fontSize: 13, fontWeight: 900, padding: '10px 14px', borderRadius: 12 }}>
              Open properties
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: 20, margin: '0 0 10px', color: '#0f172a' }}>Workspace modules</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Phase-5 modules are defined centrally and can now be implemented one at a time.</p>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>Actor: {data.tenant?.actorId || 'unknown'}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 22 }} className="workspace-modules">
          {modules.map((module) => (
            <ModuleCard key={module.key} module={module} isAvailable={module.key === 'workspace-overview' || module.key === 'properties'} />
          ))}
        </div>

        <DataTable
          columns={[
            { key: 'label', label: 'Module' },
            { key: 'route', label: 'Route' },
            { key: 'roles', label: 'Roles', render: (row) => row.roles?.join(', ') || 'All' },
            { key: 'availability', label: 'Availability', render: (row) => (
              <span style={{ padding: '5px 8px', borderRadius: 999, background: row.available ? '#dcfce7' : '#f1f5f9', color: row.available ? '#166534' : '#475569', fontSize: 11, fontWeight: 900 }}>
                {row.available ? 'Available' : 'Planned'}
              </span>
            ) },
          ]}
          rows={moduleRows}
          emptyState="No modules are available yet."
          rowKey="key"
        />
      </div>

      <style>{`@keyframes workspace-shimmer {0%{background-position:0 0}100%{background-position:200% 0}} @media (max-width: 1024px) { .workspace-grid, .workspace-modules { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } .workspace-status-grid { grid-template-columns: 1fr !important; } .workspace-status-col, .workspace-action-col { grid-column: span 12 !important; } } @media (max-width: 768px) { .workspace-grid, .workspace-modules { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}