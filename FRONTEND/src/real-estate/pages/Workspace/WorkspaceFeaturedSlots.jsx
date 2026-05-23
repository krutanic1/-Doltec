import React, { useEffect, useState } from 'react';
import { fetchFeaturedBookings } from '../../services/bookingApi';
import { Link } from 'react-router-dom';

export default function WorkspaceFeaturedSlots() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await fetchFeaturedBookings();
      if (res.success) setBookings(res.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="re-fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="re-eyebrow">Marketing & Promotions</div>
        <h1 className="re-page-title">Featured Slot Bookings</h1>
        <p className="re-page-subtitle">View and manage your currently active premium featured slots.</p>
      </div>

      <div className="re-panel">
        {loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div className="re-spinner re-spinner-dark" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#9fa6b8', fontSize: 14, fontWeight: 600 }}>Loading active slots…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="re-empty">
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f1629', margin: '0 0 8px' }}>No Active Featured Slots</h3>
            <p style={{ margin: '0 0 24px', color: '#9fa6b8', fontSize: 14 }}>You haven't promoted any listings yet.</p>
            <Link to="/real-estate/workspace/listings/all" className="re-btn re-btn-primary">Go to Listings to Promote</Link>
          </div>
        ) : (
          <div className="re-table-wrap">
            <table className="re-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 22 }}>Property</th>
                  <th>Placement</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td style={{ paddingLeft: 22 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={b.propertyId?.media?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'}
                          alt={b.propertyId?.title || 'Property'}
                          style={{ width: 46, height: 46, borderRadius: 10, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f1629', fontSize: 13.5 }}>{b.propertyId?.title || 'Unknown Property'}</div>
                          <div style={{ color: '#9fa6b8', fontSize: 11.5, marginTop: 2 }}>{b.propertyId?.city || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#303860', textTransform: 'capitalize' }}>{b.placement}</td>
                    <td style={{ color: '#6b7494', fontSize: 13 }}>{new Date(b.startAt).toLocaleDateString()}</td>
                    <td style={{ color: '#6b7494', fontSize: 13 }}>{new Date(b.endAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`re-badge re-status-${b.status === 'active' ? 'active' : 'draft'}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
