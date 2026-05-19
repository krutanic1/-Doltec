import React from 'react';

export default function ChartCard({ title, subtitle, children }) {
  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 20, boxShadow: '0 10px 30px rgba(15,23,42,.04)' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.14em', color: '#64748b' }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>{subtitle}</div> : null}
      </div>
      {children}
    </section>
  );
}
