import React, { useEffect, useState } from 'react';
import { fetchCampaignAnalytics } from '../../services/campaignApi';

export default function CampaignAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await fetchCampaignAnalytics();
      if (res.success) setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmtNum = (num) => new Intl.NumberFormat('en-IN').format(num);

  if (loading) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="re-spinner re-spinner-dark" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: '#9fa6b8', fontSize: 14, fontWeight: 600 }}>Gathering campaign metrics…</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="re-fade-in" style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <div className="re-eyebrow">Marketing Performance</div>
        <h1 className="re-page-title">Campaign Analytics</h1>
        <p className="re-page-subtitle">Track profile views, member reach, and geographic distribution for your properties.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 30 }}>
        
        <div className="re-card" style={{ background: 'linear-gradient(135deg, #0b0f1a 0%, #1a2550 100%)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(59,91,219,0.2)' }} />
          <div className="re-card-body" style={{ position: 'relative' }}>
            <div style={{ fontSize: 13, color: 'rgba(186,200,255,0.7)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Total Profile Views</div>
            <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, marginBottom: 10 }}>{fmtNum(data.totalViews)}</div>
            <div style={{ fontSize: 13, color: '#0d9276', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
              +12.5% this week
            </div>
          </div>
        </div>

        <div className="re-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="re-card-body">
            <div style={{ fontSize: 13, color: '#6b7494', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Members Reached</div>
            <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: '#0f1629', marginBottom: 10 }}>{fmtNum(data.totalReach)}</div>
            <div style={{ fontSize: 13, color: '#6b7494', fontWeight: 600 }}>Unique accounts that saw your listings</div>
          </div>
        </div>

        <div className="re-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="re-card-body">
            <div style={{ fontSize: 13, color: '#6b7494', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Engagement Rate</div>
            <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: '#0f1629', marginBottom: 10 }}>{data.engagementRate}</div>
            <div style={{ fontSize: 13, color: '#6b7494', fontWeight: 600 }}>Ratio of views to total reach</div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 24 }}>
        
        {/* Timeline Chart Mock */}
        <div style={{ gridColumn: 'span 7' }} className="analytics-left">
          <div className="re-card" style={{ height: '100%' }}>
            <div className="re-card-body" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f1629', margin: '0 0 6px' }}>Views & Reach Timeline</h3>
              <p style={{ fontSize: 13, color: '#6b7494', margin: '0 0 30px', fontWeight: 500 }}>Performance over the last 7 days</p>
              
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, paddingBottom: 20, borderBottom: '1px solid rgba(226,230,240,0.8)' }}>
                {data.timeline.map((t, i) => {
                    // normalize heights based on max values
                    const maxViews = Math.max(...data.timeline.map(d => d.views));
                    const viewsHeight = (t.views / maxViews) * 100;
                    const reachHeight = (t.reach / maxViews) * 100;
                    
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 160, width: '100%', justifyContent: 'center' }}>
                                <div style={{ width: '40%', height: `${viewsHeight}%`, background: '#3b5bdb', borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }} title={`Views: ${t.views}`} />
                                <div style={{ width: '40%', height: `${reachHeight}%`, background: '#faa219', borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }} title={`Reach: ${t.reach}`} />
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7494', whiteSpace: 'nowrap' }}>{t.date}</div>
                        </div>
                    );
                })}
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 20, justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#0f1629' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: '#3b5bdb' }} /> Views
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#0f1629' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: '#faa219' }} /> Reach
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Distribution */}
        <div style={{ gridColumn: 'span 5' }} className="analytics-right">
          <div className="re-card" style={{ height: '100%' }}>
            <div className="re-card-body">
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f1629', margin: '0 0 6px' }}>Geographic Distribution</h3>
              <p style={{ fontSize: 13, color: '#6b7494', margin: '0 0 24px', fontWeight: 500 }}>Where your properties are being viewed from</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {data.locations.map((loc, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#0f1629' }}>{loc.city}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7494' }}>{loc.percentage}% <span style={{ opacity: 0.5, fontWeight: 500 }}>({fmtNum(loc.views)})</span></span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#f1f3f9', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ 
                          width: `${loc.percentage}%`, height: '100%', 
                          background: i === 0 ? 'linear-gradient(90deg, #3b5bdb, #748ffc)' : '#9fa6b8', 
                          borderRadius: 100, transition: 'width 1s ease' 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .analytics-left, .analytics-right { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  );
}
