import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../../config/navigation';
import { getUserRole, hasPermission } from '../../utils/access';

const ICONS = {
  'layout-dashboard': 'M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM4 13h7v7H4v-7Zm9 5v-5h7v5h-7Z',
  'building-2': 'M4 20V4h7v16H4Zm9 0V8h7v12h-7Z',
  'plus-circle': 'M12 5v14M5 12h14',
  heart: 'M12 21s-7-4.35-9.5-8.64C.6 8.5 3.1 5 7 5c2.1 0 3.6 1.05 5 2.54C13.4 6.05 14.9 5 17 5c3.9 0 6.4 3.5 4.5 7.36C19 16.65 12 21 12 21Z',
  'columns-3': 'M4 5h5v14H4V5Zm6 0h4v14h-4V5Zm5 0h5v14h-5V5Z',
  inbox: 'M4 5h16l2 6v8H2v-8l2-6Zm0 0 4 8h8l4-8',
  'chart-column': 'M5 20V10m5 10V4m5 16v-7m5 7V8',
  'messages-square': 'M4 5h16v11H8l-4 4V5Z',
  'layers-3': 'M12 5 3 9l9 4 9-4-9-4Zm0 8-9-4 9 4 9-4-9 4Zm0 4-9-4 9 4 9-4-9 4Z',
  'shield-check': 'M12 3 5 6v6c0 5 3 8 7 9 4-1 7-4 7-9V6l-7-3Zm-1 9 2 2 4-4',
  'settings-2': 'M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm8 3.5-1.7.98.1 1.96 1.6 1.15-1.5 2.6-1.87-.53-1.47 1.3.15 1.95-3 .89-1.1-1.67H10.6l-1.1 1.67-3-.89.15-1.95-1.47-1.3-1.87.53-1.5-2.6 1.6-1.15.1-1.96L3 12l1.1-2 .1-1.96L2.6 6.89l1.5-2.6 1.87.53 1.47-1.3-.15-1.95 3-.89L10.6 2.5h2.8l1.1-1.67 3 .89-.15 1.95 1.47 1.3 1.87-.53 1.5 2.6-1.6 1.15-.1 1.96L20 12Z',
};

function Icon({ name }) {
  const path = ICONS[name] || ICONS['layout-dashboard'];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function Sidebar() {
  const role = getUserRole();
  const items = SIDEBAR_ITEMS.filter((item) => hasPermission(item.permission) && item.roles.includes(role));

  return (
    <aside style={{
      width: 280,
      minWidth: 280,
      background: '#0f172a',
      color: '#e2e8f0',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      position: 'sticky',
      top: 0,
      height: '100vh',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>D</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>Doltec Estates</div>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.14em' }}>{role.toLowerCase()} workspace</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
          Dashboard shell, permissions, and navigation are now centralized.
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 14, textDecoration: 'none',
              color: isActive ? '#fff' : '#cbd5e1',
              background: isActive ? 'rgba(37,99,235,.18)' : 'transparent',
              border: isActive ? '1px solid rgba(96,165,250,.28)' : '1px solid transparent',
              fontSize: 14, fontWeight: 700,
              transition: 'all .15s ease',
            })}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.href = '/real-estate';
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 14,
          background: 'transparent', border: 'none',
          color: '#f87171', cursor: 'pointer',
          fontSize: 14, fontWeight: 700,
          textAlign: 'left', width: '100%',
          transition: 'all .15s ease',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,.08)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        <span>Sign Out</span>
      </button>

      <div style={{ marginTop: 'auto', padding: 16, borderRadius: 18, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(148,163,184,.16)' }}>
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.16em', color: '#94a3b8', marginBottom: 8 }}>Rollout status</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6 }}>
          Public, dashboard, and workspace routes now share a single route source.
        </div>
      </div>
    </aside>
  );
}
