import React, { useEffect } from 'react';

export default function Modal({ open, title, children, onClose, footer = null, width = 640 }) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, .5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }} onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        style={{ width: '100%', maxWidth: width, background: '#fff', borderRadius: 24, boxShadow: '0 24px 80px rgba(15,23,42,.25)', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{title}</h2>
          <button type="button" onClick={onClose} style={{ border: 'none', background: '#f8fafc', color: '#334155', width: 34, height: 34, borderRadius: 10, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>
            ×
          </button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
        {footer ? <div style={{ padding: '0 22px 22px' }}>{footer}</div> : null}
      </div>
    </div>
  );
}
