import React from 'react';

export default function FormField({ label, error, children, hint }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.12em', color: '#64748b' }}>{label}</span>
      {children}
      {hint ? <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span> : null}
      {error ? <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 700 }}>{error}</span> : null}
    </label>
  );
}
