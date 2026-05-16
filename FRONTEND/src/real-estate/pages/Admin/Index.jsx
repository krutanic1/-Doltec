import React, { useEffect, useState } from 'react';
import api from '../../services/api/axios';
import PropertyStatusBadge from '../../components/PropertyStatusBadge';
import { moderateProperty } from '../../services/propertiesApi';

export default function AdminIndex() {
  const [items, setItems] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/properties', { params: { status: 'PENDING', limit: 50 } })
      .then((res) => {
        setItems(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await moderateProperty(id, { status: 'APPROVED', reviewNote: 'Approved by admin' });
    load();
  };

  const reject = async (id) => {
    const reason = reasons[id];
    if (!reason) {
      alert('Please provide a reason for rejection');
      return;
    }
    await moderateProperty(id, { status: 'REJECTED', reviewNote: reason });
    load();
  };

  const S = {
    font: 'Inter, sans-serif',
    card: { background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,.04)', display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, alignItems: 'start' },
    btn: (bg) => ({ background: bg, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'opacity .15s' }),
    input: { background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, width: '100%', marginBottom: 12, outline: 'none', color: '#0f172a', fontFamily: 'Inter, sans-serif' }
  };

  return (
    <section style={{ maxWidth: 1000, margin: '100px auto 100px', padding: '0 24px', fontFamily: S.font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-.03em' }}>Property Moderation</h1>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Review and verify pending listings</p>
        </div>
        <button onClick={load} style={S.btn('#2563eb')}>Refresh</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100, color: '#94a3b8' }}>Loading pending properties...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 100, background: '#fff', borderRadius: 24, border: '1px dashed #cbd5e1' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#64748b' }}>No pending properties</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {items.map((p) => {
            const img = p.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80';
            return (
              <article key={p._id} style={S.card}>
                <div style={{ width: 120, height: 120, borderRadius: 14, overflow: 'hidden', background: '#f1f5f9' }}>
                  <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{p.title}</h2>
                  <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>{p.locality}, {p.city}</p>
                  
                  <div style={{ background: '#f1f5f9', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Rejection Reason (if applicable)</p>
                    <textarea 
                      placeholder="Enter reason for rejection..."
                      value={reasons[p._id] || ''}
                      onChange={(e) => setReasons({ ...reasons, [p._id]: e.target.value })}
                      style={S.input}
                    />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button style={S.btn('#10b981')} onClick={() => approve(p._id)}>Approve Listing</button>
                      <button style={S.btn('#dc2626')} onClick={() => reject(p._id)}>Reject</button>
                    </div>
                  </div>
                </div>
                <PropertyStatusBadge status={p.status} />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
