import React from 'react';

const S = { font: 'Inter,sans-serif' };

const TRENDS = [
  { area: 'Indiranagar', change: '+12%', price: '₹14,500/sqft', up: true },
  { area: 'Whitefield',  change: '+8%',  price: '₹9,800/sqft',  up: true },
  { area: 'HSR Layout',  change: '+15%', price: '₹11,200/sqft', up: true },
  { area: 'Sarjapur',    change: '-2%',  price: '₹7,400/sqft',  up: false },
];

const RESOURCES = [
  { title: 'Stamp Duty Calculator',   icon: '📝' },
  { title: 'Legal Title Check Guide', icon: '🛡️' },
  { title: 'Home Loan Eligibility',   icon: '🏦' },
  { title: 'Vastu Consultation',      icon: '🧘' },
];

const ChevronRight = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
  </svg>
);

export default function MarketIntelligenceSidebar({ city = 'Bengaluru' }) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: S.font }}>

      {/* Market Analytics */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '22px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#0f172a', margin: 0 }}>Market Analytics</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>Live</span>
          </div>
        </div>

        {/* City average */}
        <div style={{ background: '#eff6ff', borderRadius: 12, padding: '14px 16px', marginBottom: 16, border: '1px solid #dbeafe' }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#2563eb', margin: '0 0 6px' }}>City Avg · {city}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-.03em' }}>₹8,450</span>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>/sqft</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 800, color: '#10b981' }}>+4.2% YoY</span>
          </div>
        </div>

        {/* Trend rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TRENDS.map(t => (
            <div key={t.area} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{t.area}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, margin: 0 }}>{t.price}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: t.up ? '#10b981' : '#ef4444', margin: '0 0 4px' }}>{t.change}</p>
                <div style={{ width: 48, height: 3, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: t.up ? '75%' : '25%', height: '100%', background: t.up ? '#10b981' : '#ef4444', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment card */}
      <div style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 100%)',
        borderRadius: 16, padding: '22px 20px', color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(59,130,246,.15)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b', margin: '0 0 14px' }}>Locality Sentiment</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[{ l: 'Demand Score', v: 'High', c: '#60a5fa' }, { l: 'Growth Index', v: '8.4', c: '#4ade80' }].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '12px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b', margin: '0 0 4px' }}>{s.l}</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: s.c, margin: 0 }}>{s.v}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
          "Inventory absorption in {city} has increased by 14% this quarter, indicating a strong seller's market."
        </p>
      </div>

      {/* Expert Resources */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '22px 20px' }}>
        <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#0f172a', margin: '0 0 14px' }}>Expert Resources</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {RESOURCES.map(r => (
            <button key={r.title} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px',
              borderRadius: 10, border: '1px solid #f1f5f9', background: '#fafafa',
              cursor: 'pointer', fontFamily: S.font, textAlign: 'left', transition: 'all .15s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', flex: 1 }}>{r.title}</span>
              <span style={{ color: '#94a3b8' }}><ChevronRight /></span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        borderRadius: 16, padding: '24px 20px', textAlign: 'center',
        boxShadow: '0 8px 24px rgba(37,99,235,.2)',
      }}>
        <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Need Expert Advice?</h4>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', margin: '0 0 18px', lineHeight: 1.6 }}>
          Our property consultants will help you find the best deal.
        </p>
        <button style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#fff', color: '#2563eb', fontFamily: S.font,
          fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all .15s',
        }}
          onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}
        >Book Free Consultation</button>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </aside>
  );
}
