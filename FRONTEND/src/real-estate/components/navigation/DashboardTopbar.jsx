import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStoredUser, getUserRole } from '../../utils/access';
import '../../re.css';

const ROLE_COLORS = {
  ADMIN:   { bg: 'rgba(240,62,94,0.12)', color: '#f03e5e', border: 'rgba(240,62,94,0.2)' },
  SELLER:  { bg: 'rgba(59,91,219,0.12)', color: '#748ffc', border: 'rgba(59,91,219,0.2)' },
  BUILDER: { bg: 'rgba(234,137,12,0.12)', color: '#faa219', border: 'rgba(234,137,12,0.2)' },
  AGENT:   { bg: 'rgba(13,146,118,0.12)', color: '#20c997', border: 'rgba(13,146,118,0.2)' },
  OWNER:   { bg: 'rgba(116,143,252,0.12)', color: '#bac8ff', border: 'rgba(116,143,252,0.2)' },
};

export default function DashboardTopbar({ title, subtitle, actions }) {
  const user = getStoredUser();
  const role = getUserRole(user);
  const navigate = useNavigate();
  const roleStyle = ROLE_COLORS[role] || ROLE_COLORS.OWNER;
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
      padding: '14px 28px',
      borderBottom: '1px solid rgba(226,230,240,0.8)',
      background: 'rgba(248,249,252,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxShadow: '0 2px 12px rgba(15,22,50,0.05)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Breadcrumb / role pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            padding: '3px 9px',
            borderRadius: 100,
            background: roleStyle.bg,
            color: roleStyle.color,
            border: `1px solid ${roleStyle.border}`,
          }}>{role.toLowerCase()}</span>
          <span style={{ fontSize: 12, color: '#9fa6b8', fontWeight: 500 }}>·</span>
          <Link to="/real-estate/workspace" style={{
            fontSize: 12, color: '#9fa6b8', fontWeight: 600, textDecoration: 'none', transition: 'color 0.18s',
          }}
            onMouseOver={e => e.currentTarget.style.color = '#3b5bdb'}
            onMouseOut={e => e.currentTarget.style.color = '#9fa6b8'}
          >Workspace</Link>
          {title !== 'Dashboard' && (
            <>
              <span style={{ fontSize: 12, color: '#9fa6b8' }}>›</span>
              <span style={{ fontSize: 12, color: '#3b5bdb', fontWeight: 600 }}>{title}</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {actions}

        {/* Post Property Quick Button */}
        <Link
          to="/real-estate/post-property"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
            color: '#fff', textDecoration: 'none',
            padding: '8px 16px', borderRadius: 10,
            fontWeight: 700, fontSize: 12.5,
            boxShadow: '0 4px 14px rgba(59,91,219,0.3)',
            transition: 'all 0.18s ease',
            letterSpacing: '-0.01em',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,91,219,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,91,219,0.3)'; }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          New Listing
        </Link>

        {/* User Avatar + Name */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          background: '#fff',
          border: '1px solid rgba(226,230,240,0.9)',
          borderRadius: 10,
          padding: '7px 12px 7px 8px',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          boxShadow: '0 2px 8px rgba(15,22,50,0.05)',
        }}
          onClick={() => navigate('/real-estate/dashboard')}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#bac8ff'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,91,219,0.12)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(226,230,240,0.9)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,22,50,0.05)'; }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b5bdb, #2537a0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 12,
            border: '2px solid rgba(116,143,252,0.3)',
          }}>{initial}</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1c2248' }}>
            {user?.name?.split(' ')[0] || 'Account'}
          </span>
        </div>
      </div>
    </header>
  );
}
