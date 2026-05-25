import React, { useEffect, useMemo, useState } from 'react';
import { approveFeatureBooking, fetchFeaturedBookings, rejectFeatureBooking } from '../real-estate/services/bookingApi';
import Cookies from 'js-cookie';

const getAdminAuthConfig = () => {
  const adminToken = Cookies.get('adminToken');
  if (!adminToken) return {};
  return {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };
};

const STATUS_LABELS = {
  pending: { label: 'Pending Review', color: '#c47011', bg: 'rgba(250,162,25,0.14)' },
  active: { label: 'Approved', color: '#15803d', bg: 'rgba(34,197,94,0.12)' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: 'rgba(239,68,68,0.12)' },
  booked: { label: 'Booked', color: '#475569', bg: 'rgba(148,163,184,0.12)' },
};

export default function Feature() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectNotes, setRejectNotes] = useState({});
  const [workingId, setWorkingId] = useState(null);

  const pendingCount = useMemo(() => requests.filter((request) => request.status === 'pending').length, [requests]);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchFeaturedBookings({ status: 'pending' }, getAdminAuthConfig());
      setRequests(res.bookings || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load feature requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (bookingId) => {
    setWorkingId(bookingId);
    try {
      await approveFeatureBooking(bookingId, getAdminAuthConfig());
      await loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Failed to approve feature request.');
    } finally {
      setWorkingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    const reviewNote = rejectNotes[bookingId]?.trim();
    if (!reviewNote) {
      alert('Please add a rejection reason.');
      return;
    }

    setWorkingId(bookingId);
    try {
      await rejectFeatureBooking(bookingId, reviewNote, getAdminAuthConfig());
      setRejectNotes((prev) => {
        const next = { ...prev };
        delete next[bookingId];
        return next;
      });
      await loadRequests();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Failed to reject feature request.');
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section style={{ maxWidth: 1180, margin: '80px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>Pending Feature Requests</h1>
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500, marginTop: 8 }}>Review only pending listing feature requests before they go live.</p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '11px 18px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 24px rgba(37,99,235,0.25)',
          }}
        >
          Refresh Requests
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Pending Requests', value: pendingCount, accent: '#c47011' },
          { label: 'Visible After Approval', value: '30 Days', accent: '#3b5bdb' },
          { label: 'Review Mode', value: 'Admin Only', accent: '#0f172a' },
        ].map((card) => (
          <div key={card.label} style={{ background: '#fff', border: `1px solid ${card.accent}22`, borderRadius: 20, padding: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</div>
            <div style={{ marginTop: 10, color: card.accent, fontSize: 28, fontWeight: 900 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.04)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '72px 24px', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Loading feature requests...</div>
        ) : error ? (
          <div style={{ padding: '72px 24px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>{error}</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '72px 24px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: 18, fontWeight: 800 }}>No pending feature requests</h3>
            <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: 14 }}>New requests will appear here when listers submit a listing for feature review.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '16px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Listing</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Placement</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Submitted</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
                  <th style={{ padding: '16px 20px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => {
                  const statusMeta = STATUS_LABELS[request.status] || STATUS_LABELS.pending;
                  const image = request.propertyId?.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80';

                  return (
                    <tr key={request._id} style={{ borderTop: '1px solid #eef2f7', verticalAlign: 'top' }}>
                      <td style={{ padding: '18px 20px' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <img src={image} alt={request.propertyId?.title || 'Listing'} style={{ width: 58, height: 58, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 14 }}>{request.propertyId?.title || 'Unknown listing'}</div>
                            <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{request.propertyId?.city || 'City unavailable'}</div>
                            <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>Posted by {request.createdBy?.name || 'Lister'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '18px 20px', color: '#334155', fontWeight: 700, textTransform: 'capitalize' }}>{request.placement || 'homepage'}</td>
                      <td style={{ padding: '18px 20px', color: '#64748b', fontWeight: 600 }}>
                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '18px 20px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, color: statusMeta.color, background: statusMeta.bg, fontSize: 12, fontWeight: 800 }}>
                          {statusMeta.label}
                        </span>
                        {request.status === 'rejected' && request.reviewNote ? (
                          <div style={{ marginTop: 8, maxWidth: 240, color: '#7f1d1d', fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>
                            Reason: {request.reviewNote}
                          </div>
                        ) : null}
                      </td>
                      <td style={{ padding: '18px 20px', minWidth: 360 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <textarea
                            rows={3}
                            placeholder="Enter rejection reason"
                            value={rejectNotes[request._id] || ''}
                            onChange={(e) => setRejectNotes((prev) => ({ ...prev, [request._id]: e.target.value }))}
                            className="re-input"
                            style={{
                              width: '100%',
                              minHeight: 84,
                              resize: 'vertical',
                              color: '#0f172a',
                              fontSize: 13,
                              lineHeight: 1.5,
                              borderColor: '#dbe2ea',
                              background: '#fff',
                            }}
                          />
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => handleApprove(request._id)}
                            disabled={workingId === request._id}
                            style={{
                              background: '#16a34a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 12,
                              padding: '10px 16px',
                              fontWeight: 800,
                              cursor: workingId === request._id ? 'wait' : 'pointer',
                              opacity: workingId === request._id ? 0.75 : 1,
                            }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(request._id)}
                            disabled={workingId === request._id}
                            style={{
                              background: '#dc2626',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 12,
                              padding: '10px 16px',
                              fontWeight: 800,
                              cursor: workingId === request._id ? 'wait' : 'pointer',
                              opacity: workingId === request._id ? 0.75 : 1,
                            }}
                          >
                            Reject
                          </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}