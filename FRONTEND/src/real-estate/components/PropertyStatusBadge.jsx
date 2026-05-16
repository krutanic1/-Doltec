import React from 'react';

const BADGE_MAP = {
  APPROVED:  { label: 'Approved', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  PENDING:   { label: 'Pending',  bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  DRAFT:     { label: 'Draft',    bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
  REJECTED:  { label: 'Rejected', bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
};

export default function PropertyStatusBadge({ status }) {
  const cfg = BADGE_MAP[status] || BADGE_MAP.DRAFT;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 30,
      background: cfg.bg, color: cfg.color,
      fontSize: 10, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: '.08em',
      fontFamily: 'Inter,sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}
