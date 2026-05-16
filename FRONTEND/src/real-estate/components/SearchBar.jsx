import React, { useState } from 'react';

const S = { font: 'Inter,sans-serif' };

export default function SearchBar({ value = '', onChange, city = 'Bengaluru', onSearch }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#f8fafc',
      border: `1.5px solid ${focused ? '#2563eb' : '#e2e8f0'}`,
      borderRadius: 10, padding: '0 14px',
      transition: 'border-color .15s, box-shadow .15s',
      boxShadow: focused ? '0 0 0 3px rgba(37,99,235,.1)' : 'none',
    }}>
      <svg width="15" height="15" fill="none" stroke={focused ? '#2563eb' : '#94a3b8'} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        type="text"
        value={value}
        placeholder={`Search in ${city}…`}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch?.()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontFamily: S.font, fontSize: 13, fontWeight: 500, color: '#334155',
          padding: '11px 0',
        }}
      />
      {value && (
        <button onClick={() => onChange?.('')} style={{
          width: 18, height: 18, borderRadius: '50%', border: 'none',
          background: '#e2e8f0', color: '#64748b', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 800, flexShrink: 0,
        }}>✕</button>
      )}
    </div>
  );
}
