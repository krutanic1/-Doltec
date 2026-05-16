import React from 'react';

const S = { font: 'Inter,sans-serif' };

export default function EmptyState({ clearFilters }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
      padding: '80px 40px', textAlign: 'center', fontFamily: S.font,
    }}>
      {/* Illustration */}
      <div style={{
        width: 96, height: 96, borderRadius: 24, background: '#eff6ff',
        border: '2px solid #dbeafe',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 28px',
      }}>
        <svg width="44" height="44" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-.02em' }}>
        No Properties Found
      </h3>
      <p style={{ fontSize: 15, color: '#64748b', fontWeight: 500, margin: '0 0 32px', lineHeight: 1.6, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
        We couldn't find any properties matching your filters. Try adjusting your search criteria.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={clearFilters} style={{
          padding: '12px 28px', borderRadius: 12, border: 'none',
          background: '#2563eb', color: '#fff', fontFamily: S.font,
          fontWeight: 700, fontSize: 14, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(37,99,235,.2)', transition: 'background .15s',
        }}
          onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
          onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
        >
          Clear All Filters
        </button>
        <button onClick={() => window.location.reload()} style={{
          padding: '12px 28px', borderRadius: 12,
          border: '1.5px solid #e2e8f0', background: '#fff',
          color: '#334155', fontFamily: S.font,
          fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all .15s',
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          Refresh
        </button>
      </div>

      {/* Suggested filters */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #f1f5f9' }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8', marginBottom: 14 }}>
          Popular Searches
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {['3 BHK Apartments', 'Luxury Villas', 'Ready to Move', 'Under ₹50L', 'New Projects'].map(tag => (
            <span key={tag} style={{
              padding: '6px 14px', borderRadius: 30,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              fontSize: 12, fontWeight: 600, color: '#475569',
              cursor: 'pointer', transition: 'all .15s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.color = '#2563eb'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
            >{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
