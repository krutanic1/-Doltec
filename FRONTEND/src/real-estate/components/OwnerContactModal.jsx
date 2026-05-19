import React from 'react';
import { createPortal } from 'react-dom';

const S = {
  font: 'Inter, sans-serif',
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10000, padding: 16, fontFamily: 'Inter, sans-serif'
  },
  card: {
    background: '#fff', width: '100%', maxWidth: 440, borderRadius: 24,
    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #e2e8f0', animation: 're-modal-fade .3s cubic-bezier(0.16, 1, 0.3, 1)',
    color: '#0f172a'
  },
  header: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    padding: '28px 28px 24px', position: 'relative', color: '#fff'
  },
  closeBtn: {
    position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)',
    border: 'none', width: 32, height: 32, borderRadius: '50%', color: '#fff',
    fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background .15s'
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)',
    color: '#4ade80', fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '.06em', padding: '4px 10px', borderRadius: 30, marginBottom: 12
  },
  title: { fontSize: 20, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-.02em' },
  sub: { color: '#93c5fd', fontSize: 13, margin: 0, fontWeight: 500 },
  body: { padding: 28 },
  detailRow: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14,
    marginBottom: 12, textDecoration: 'none', color: '#0f172a', transition: 'border-color .15s'
  },
  actionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }
};

export default function OwnerContactModal({ isOpen, onClose, owner, propertyName = 'property' }) {
  if (!isOpen || !owner) return null;

  const phone = owner.phone || '';
  const email = owner.email || '';
  const name  = owner.name || 'Property Owner';

  // Clean phone number for WhatsApp url
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waMsg = `Hi ${name}, I'm interested in your property "${propertyName}" posted on Doltec Estates. Please share more details.`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

  return createPortal(
    <div 
      onClick={e => { e.preventDefault(); e.stopPropagation(); onClose(); }}
      onMouseOver={e => e.stopPropagation()}
      onMouseOut={e => e.stopPropagation()}
      onMouseEnter={e => e.stopPropagation()}
      onMouseLeave={e => e.stopPropagation()}
      style={S.overlay}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={S.card}
      >
        {/* Header */}
        <div style={S.header}>
          <button 
            onClick={onClose} 
            style={S.closeBtn}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >✕</button>

          <span style={S.badge}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
            Owner Contact Unlocked
          </span>
          <h3 style={S.title}>{name}</h3>
          <p style={S.sub}>Direct contact credentials for this property listing.</p>
        </div>

        {/* Content Body */}
        <div style={S.body}>
          {/* Phone row */}
          {phone && (
            <a 
              href={`tel:${phone}`} 
              style={S.detailRow}
              onMouseOver={e => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <span style={{ fontSize: 20 }}>📞</span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b', margin: '0 0 2px' }}>Verified Mobile</p>
                <p style={{ fontSize: 14, fontWeight: 750, margin: 0 }}>{phone}</p>
              </div>
            </a>
          )}

          {/* Email row */}
          {email && (
            <a 
              href={`mailto:${email}`} 
              style={S.detailRow}
              onMouseOver={e => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <span style={{ fontSize: 20 }}>✉</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#64748b', margin: '0 0 2px' }}>Registered Email</p>
                <p style={{ fontSize: 14, fontWeight: 750, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{email}</p>
              </div>
            </a>
          )}

          {/* Action buttons */}
          <div style={S.actionsGrid}>
            <a 
              href={`tel:${phone}`}
              style={{
                background: '#2563eb', color: '#fff', textDecoration: 'none',
                textAlign: 'center', padding: '14px 16px', borderRadius: 12,
                fontSize: 13.5, fontWeight: 800, transition: 'background .15s',
                boxShadow: '0 4px 14px rgba(37,99,235,0.15)', display: 'block'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
            >
              Call Owner
            </a>
            <a 
              href={waUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                background: '#16a34a', color: '#fff', textDecoration: 'none',
                textAlign: 'center', padding: '14px 16px', borderRadius: 12,
                fontSize: 13.5, fontWeight: 800, transition: 'background .15s',
                boxShadow: '0 4px 14px rgba(22,163,74,0.15)', display: 'block'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#15803d'}
              onMouseOut={e => e.currentTarget.style.background = '#16a34a'}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes re-modal-fade {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
