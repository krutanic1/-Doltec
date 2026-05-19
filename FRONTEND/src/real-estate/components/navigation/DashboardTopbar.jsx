import React from 'react';
import { getStoredUser, getUserRole } from '../../utils/access';

export default function DashboardTopbar({ title, subtitle, actions }) {
  const user = getStoredUser();
  const role = getUserRole(user);

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '24px 28px', borderBottom: '1px solid #e2e8f0', background: 'rgba(248,250,252,.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '.14em' }}>{role.toLowerCase()}</div>
        <h1 style={{ margin: '8px 0 6px', fontSize: 28, fontWeight: 900, letterSpacing: '-.04em', color: '#0f172a' }}>{title}</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {actions}
        <div style={{ padding: '10px 14px', borderRadius: 999, background: '#fff', border: '1px solid #e2e8f0', color: '#334155', fontSize: 13, fontWeight: 700 }}>
          {user?.name || 'Guest'}
        </div>
      </div>
    </header>
  );
}
