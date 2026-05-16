import React from 'react';
import { Link } from 'react-router-dom';

const S = { font: 'Inter,sans-serif' };

const fmt = (n) => {
  const v = Number(n || 0);
  if (!v) return 'P.O.R';
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)} Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)} L`;
  return `₹${v.toLocaleString('en-IN')}`;
};

export default function CompareBar({ selectedProperties = [], onRemove, onClear, onCompare }) {
  if (selectedProperties.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500,
      background: '#fff', borderTop: '2px solid #2563eb',
      boxShadow: '0 -8px 40px rgba(0,0,0,.12)',
      fontFamily: S.font,
    }}>
      <div style={{
        maxWidth: 1380, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        {/* Label */}
        <div style={{ flexShrink: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#2563eb', margin: '0 0 2px' }}>Compare Mode</p>
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, margin: 0 }}>
            {selectedProperties.length}/3 properties selected
          </p>
        </div>

        <div style={{ width: 1, height: 40, background: '#e2e8f0', flexShrink: 0 }} />

        {/* Property slots */}
        <div style={{ display: 'flex', gap: 10, flex: 1, overflowX: 'auto' }}>
          {selectedProperties.map(p => (
            <div key={p._id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#f8fafc', border: '1.5px solid #e2e8f0',
              borderRadius: 10, padding: '8px 12px', flexShrink: 0,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: '#e2e8f0', flexShrink: 0 }}>
                <img
                  src={p.images?.[0]?.url || p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&q=60'}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{p.title}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', margin: 0 }}>{fmt(p.price?.amount)}</p>
              </div>
              <button onClick={() => onRemove(p._id)} style={{
                width: 22, height: 22, borderRadius: '50%', border: 'none',
                background: '#fee2e2', color: '#ef4444', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontFamily: S.font, fontSize: 11, fontWeight: 800, transition: 'background .15s',
              }}
                onMouseOver={e => e.currentTarget.style.background = '#fecaca'}
                onMouseOut={e => e.currentTarget.style.background = '#fee2e2'}
              >✕</button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 3 - selectedProperties.length }).map((_, i) => (
            <div key={i} style={{
              width: 160, height: 54, borderRadius: 10,
              border: '1.5px dashed #e2e8f0', background: '#fafafa',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>+ Add Property</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={onClear} style={{
            padding: '10px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: '#fff', color: '#64748b', fontFamily: S.font,
            fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#334155'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
          >Clear</button>
          <button
            onClick={onCompare}
            disabled={selectedProperties.length < 2}
            style={{
              padding: '10px 22px', borderRadius: 10, border: 'none',
              background: selectedProperties.length >= 2 ? '#2563eb' : '#e2e8f0',
              color: selectedProperties.length >= 2 ? '#fff' : '#94a3b8',
              fontFamily: S.font, fontWeight: 700, fontSize: 13,
              cursor: selectedProperties.length >= 2 ? 'pointer' : 'not-allowed',
              boxShadow: selectedProperties.length >= 2 ? '0 4px 14px rgba(37,99,235,.2)' : 'none',
              transition: 'all .15s',
            }}
            onMouseOver={e => { if (selectedProperties.length >= 2) e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseOut={e => { if (selectedProperties.length >= 2) e.currentTarget.style.background = '#2563eb'; }}
          >Compare Now →</button>
        </div>
      </div>
    </div>
  );
}
