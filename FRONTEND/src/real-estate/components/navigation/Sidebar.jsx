import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../../config/navigation';
import { getUserRole, hasPermission, getStoredUser } from '../../utils/access';
import '../../re.css';

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

function Icon({ name, size = 17 }) {
  const path = ICONS[name] || ICONS['layout-dashboard'];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const role = getUserRole();
  const user = getStoredUser();
  const items = SIDEBAR_ITEMS.filter((item) => hasPermission(item.permission) && item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/real-estate');
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <aside style={{
      width: 256,
      minWidth: 256,
      background: 'linear-gradient(180deg, #0b0f1a 0%, #0f1629 100%)',
      color: '#e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      boxSizing: 'border-box',
      overflowY: 'auto',
      scrollbarWidth: 'none',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      zIndex: 10,
    }}>

      {/* Brand section */}
      <div style={{ padding: '22px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 16,
            boxShadow: '0 4px 16px rgba(59,91,219,0.4)',
            flexShrink: 0,
          }}>D</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Doltec Estates</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.16em', marginTop: 1 }}>{role.toLowerCase()} workspace</div>
          </div>
        </div>


      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 8px 4px', marginBottom: 2 }}>
          Navigation
        </div>
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 11,
              padding: '10px 12px', borderRadius: 12, textDecoration: 'none',
              color: isActive ? '#bac8ff' : 'rgba(255,255,255,0.55)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(59,91,219,0.24), rgba(37,55,160,0.14))'
                : 'transparent',
              border: isActive ? '1px solid rgba(116,143,252,0.22)' : '1px solid transparent',
              fontSize: 13.5, fontWeight: isActive ? 700 : 600,
              transition: 'all 0.18s ease',
            })}
            onMouseOver={e => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseOut={e => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '12px 12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 12px', borderRadius: 12,
            background: 'transparent',
            border: '1px solid transparent',
            color: 'rgba(248,113,113,0.75)',
            cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
            textAlign: 'left', width: '100%',
            transition: 'all 0.18s ease',
            fontFamily: 'inherit',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(240,62,94,0.08)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.75)'; }}
        >
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
