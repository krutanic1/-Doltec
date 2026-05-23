import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyList } from '../hooks/useRealEstate';
import PropertyCard from '../components/PropertyCard';

const TABS = [
  { label: 'Buy', value: 'BUY' },
  { label: 'Rent', value: 'RENT' },
  { label: 'New Projects', value: 'PROJECTS' },
  { label: 'Commercial', value: 'COMMERCIAL' },
];

const CITIES = [
  { label: 'Bengaluru', value: 'bengaluru', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80' },
  { label: 'Mumbai',    value: 'mumbai',    img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80' },
  { label: 'Pune',      value: 'pune',      img: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=600&q=80' },
  { label: 'Hyderabad', value: 'hyderabad', img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=600&q=80' },
];

const STATS = [
  { value: '25,000+', label: 'Verified Listings',  icon: <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
  { value: '10,000+', label: 'Happy Owners',        icon: <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  { value: '₹2.4Cr',  label: 'Avg. Deal Value',     icon: <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg> },
  { value: '99%',     label: 'Trust Score',          icon: <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
];

const QUICK = [
  { title: 'Saved Properties', desc: 'Revisit your shortlisted gems anytime.', to: '/real-estate/saved',         cta: 'Open Saved',   icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> },
  { title: 'Compare Listings', desc: 'Side-by-side comparison for smarter decisions.', to: '/real-estate/compare', cta: 'Compare Now', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg> },
  { title: 'Post Property',    desc: 'List your property and attract verified buyers.', to: '/real-estate/post-property', cta: 'List Free', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> },
];

const WHY = [
  { title: 'RERA Verified', desc: 'Every listing passes multi-stage RERA and legal verification before going live.', icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
  { title: 'Market Intelligence', desc: 'Data-driven insights on locality pricing trends, infrastructure, and growth.', icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
  { title: 'Zero Brokerage', desc: 'Connect directly with verified owners — no middlemen, no hidden fees.', icon: <svg width="24" height="24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('BUY');
  const [q, setQ]     = useState('');
  const [count, setCount] = useState(0);

  const { data, loading } = usePropertyList({ limit: 8, status: 'APPROVED' });
  const properties = Array.isArray(data) ? data : data?.data || [];

  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { n += 312; if (n >= 25000) { setCount(25000); clearInterval(t); } else setCount(n); }, 16);
    return () => clearInterval(t);
  }, []);

  const doSearch = () => {
    const p = new URLSearchParams();
    p.set('intent', tab === 'RENT' ? 'RENT' : 'BUY');
    if (tab === 'PROJECTS')   p.set('segment', 'PROJECTS');
    if (tab === 'COMMERCIAL') p.set('segment', 'COMMERCIAL');
    if (q) p.set('q', q);
    navigate(`/real-estate/properties?${p}`);
  };

  return (
    <div style={{ background: '#fff', fontFamily: 'Inter,sans-serif', overflowX: 'hidden', width: '100%' }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #050d1a 0%, #0a1628 45%, #0f2040 75%, #162952 100%)',
        paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(60px,8vw,110px)', position: 'relative', overflow: 'hidden', width: '100%', boxSizing: 'border-box',
      }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: .04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow orbs */}
        <div style={{ position:'absolute', top:-120, right:-80, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,.07) 0%, transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-60, width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,.08) 0%, transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px,4vw,28px)', position:'relative', zIndex:1, boxSizing:'border-box', width:'100%' }}>
          {/* Eyebrow */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:10,
            padding:'6px 18px', borderRadius:30,
            background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.2)',
            marginBottom:28, color:'#f59e0b', fontSize:11, fontWeight:700,
            textTransform:'uppercase', letterSpacing:'.16em',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#f59e0b', display:'inline-block', animation:'hpulse 2s ease-in-out infinite' }} />
            India's Premier Property Marketplace
          </div>

          <h1 style={{
            fontSize:'clamp(30px,7vw,68px)', fontWeight:900, color:'#fff',
            margin:'0 0 22px', letterSpacing:'-.04em', lineHeight:1.08, maxWidth:720,
          }}>
            Find Your{' '}
            <span style={{
              background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>Dream Home</span>
            <br />with Confidence.
          </h1>

          <p style={{ color:'rgba(255,255,255,.6)', fontSize:'clamp(14px,3.5vw,18px)', fontWeight:400, margin:'0 0 40px', maxWidth:520, lineHeight:1.7 }}>
            Browse {count.toLocaleString()}+ verified listings from luxury villas to smart apartments — all in one place.
          </p>

          {/* Search Card */}
          <div style={{
            maxWidth:860, background:'rgba(255,255,255,.04)',
            backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
            border:'1px solid rgba(255,255,255,.1)',
            borderRadius:20, padding:10,
            boxShadow:'0 32px 80px rgba(0,0,0,.35)',
          }}>
            {/* Tab row */}
            <div style={{ display:'flex', gap:4, marginBottom:8, flexWrap:'wrap' }}>
              {TABS.map(t => (
                <button key={t.value} onClick={() => setTab(t.value)} style={{
                  padding:'9px 20px', borderRadius:11, border:'none', cursor:'pointer',
                  fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:700, transition:'all .18s',
                  background: tab === t.value ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'transparent',
                  color: tab === t.value ? '#050d1a' : 'rgba(255,255,255,.6)',
                  boxShadow: tab === t.value ? '0 4px 14px rgba(245,158,11,.3)' : 'none',
                }}>{t.label}</button>
              ))}
            </div>
            {/* Search row */}
            <div style={{ display:'flex', gap:8 }} className="re-search-row">
              <div style={{
                flex:1, display:'flex', alignItems:'center', gap:10,
                background:'#fff', borderRadius:12, padding:'0 18px',
              }}>
                <svg width="16" height="16" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text" placeholder="Enter locality, project or builder…"
                  value={q} onChange={e => setQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                  style={{
                    flex:1, border:'none', background:'transparent', outline:'none',
                    fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:500, color:'#0a1628', padding:'16px 0',
                  }}
                />
              </div>
              <button onClick={doSearch} style={{
                background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#050d1a',
                border:'none', padding:'16px 32px', borderRadius:12,
                fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:800, cursor:'pointer',
                boxShadow:'0 6px 20px rgba(245,158,11,.35)', transition:'all .2s', whiteSpace:'nowrap',
              }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(245,158,11,.45)'; }}
                onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(245,158,11,.35)'; }}
              >Search Properties →</button>
            </div>
          </div>

          {/* Hero stats */}
          <div style={{ display:'flex', gap:36, marginTop:44, flexWrap:'wrap' }}>
            {[['25K+','Listings'],['10K+','Owners'],['99%','Trust Score']].map(([v,l]) => (
              <div key={l}>
                <p style={{ fontSize:22, fontWeight:900, color:'#f59e0b', margin:0, letterSpacing:'-.03em' }}>{v}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,.45)', margin:'3px 0 0', fontWeight:600, textTransform:'uppercase', letterSpacing:'.1em' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background:'#050d1a', padding:'0 clamp(16px,4vw,28px)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }} className="re-stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding:'32px 24px', textAlign:'center',
              borderRight: i < STATS.length-1 ? '1px solid rgba(255,255,255,.06)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{s.icon}</div>
              <p style={{ fontSize:26, fontWeight:900, color:'#f59e0b', margin:'0 0 4px', letterSpacing:'-.03em' }}>{s.value}</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', fontWeight:600, margin:0, textTransform:'uppercase', letterSpacing:'.1em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section style={{ padding:'clamp(48px,8vw,90px) clamp(16px,4vw,28px) clamp(48px,8vw,80px)', background:'#f9fafb' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ marginBottom:48, textAlign:'center' }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.18em', color:'#d97706', margin:'0 0 12px', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <span style={{ display:'inline-block', width:20, height:2, background:'#f59e0b', borderRadius:2 }} />
              Platform Tools
              <span style={{ display:'inline-block', width:20, height:2, background:'#f59e0b', borderRadius:2 }} />
            </p>
            <h2 style={{ fontSize:36, fontWeight:900, color:'#0a1628', margin:0, letterSpacing:'-.03em' }}>Everything you need,<br/><span style={{ color:'#94a3b8' }}>in one place.</span></h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="re-quick-grid">
            {QUICK.map((a, idx) => (
              <div key={a.title} style={{
                background:'#fff', border:'1px solid #e5e7eb', borderRadius:24,
                padding:32, boxShadow:'0 4px 24px rgba(0,0,0,.05)',
                transition:'all .25s', cursor:'pointer',
              }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 60px rgba(0,0,0,.1)'; e.currentTarget.style.borderColor='rgba(245,158,11,.3)'; }}
                onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,.05)'; e.currentTarget.style.borderColor='#e5e7eb'; }}
                onClick={() => navigate(a.to)}
              >
                <div style={{
                  width:56, height:56, borderRadius:16,
                  background: idx === 2 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#050d1a',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: idx === 2 ? '#050d1a' : '#f59e0b', fontSize:22, marginBottom:20,
                  boxShadow: idx === 2 ? '0 8px 24px rgba(245,158,11,.3)' : '0 8px 24px rgba(5,13,26,.25)',
                }}>{a.icon}</div>
                <h3 style={{ fontSize:19, fontWeight:800, color:'#0a1628', margin:'0 0 10px' }}>{a.title}</h3>
                <p style={{ color:'#6b7280', fontSize:14, lineHeight:1.65, margin:'0 0 24px' }}>{a.desc}</p>
                <button onClick={e => { e.stopPropagation(); navigate(a.to); }} style={{
                  background: idx === 2 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#050d1a',
                  color: idx === 2 ? '#050d1a' : '#fff',
                  border:'none', padding:'12px 20px', borderRadius:12,
                  fontWeight:800, cursor:'pointer', width:'100%', fontSize:13,
                  fontFamily:'Inter,sans-serif',
                }}>{a.cta} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE CITIES ── */}
      <section style={{ padding:'clamp(48px,8vw,90px) clamp(16px,4vw,28px)', background:'#fff' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:44 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.18em', color:'#d97706', margin:'0 0 12px' }}>Browse by City</p>
              <h2 style={{ fontSize:36, fontWeight:900, color:'#0a1628', margin:0, letterSpacing:'-.03em' }}>Explore Top Cities</h2>
              <p style={{ fontSize:15, color:'#6b7280', margin:'10px 0 0', fontWeight:400 }}>Find your next home in India's prime localities</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="re-city-grid">
            {CITIES.map(city => (
              <div key={city.value}
                onClick={() => navigate(`/real-estate/properties?city=${city.value}`)}
                style={{ borderRadius:20, overflow:'hidden', aspectRatio:'3/4', position:'relative', cursor:'pointer' }}
                onMouseOver={e => { e.currentTarget.querySelector('img').style.transform='scale(1.08)'; }}
                onMouseOut={e => { e.currentTarget.querySelector('img').style.transform='scale(1)'; }}
              >
                <img src={city.img} alt={city.label} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .7s cubic-bezier(.4,0,.2,1)' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,13,26,.85) 0%, rgba(5,13,26,.2) 55%, transparent 100%)' }} />
                <div style={{ position:'absolute', bottom:22, left:22 }}>
                  <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.14em', color:'#f59e0b', margin:'0 0 5px' }}>Explore</p>
                  <p style={{ fontSize:22, fontWeight:900, color:'#fff', margin:0, letterSpacing:'-.02em' }}>{city.label}</p>
                </div>
                <div style={{ position:'absolute', top:16, right:16, background:'rgba(245,158,11,.15)', border:'1px solid rgba(245,158,11,.3)', borderRadius:20, padding:'4px 10px' }}>
                  <span style={{ fontSize:10, fontWeight:800, color:'#f59e0b', textTransform:'uppercase', letterSpacing:'.08em' }}>Hot Market</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section style={{ background:'#f9fafb', borderTop:'1px solid #e5e7eb', padding:'clamp(48px,8vw,90px) clamp(16px,4vw,28px)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:44 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.18em', color:'#d97706', margin:'0 0 12px' }}>New Arrivals</p>
              <h2 style={{ fontSize:36, fontWeight:900, color:'#0a1628', margin:0, letterSpacing:'-.03em' }}>Latest Properties</h2>
              <p style={{ fontSize:15, color:'#6b7280', margin:'10px 0 0', fontWeight:400 }}>Discover the newest additions to our marketplace</p>
            </div>
            <button onClick={() => navigate('/real-estate/properties')} style={{
              display:'flex', alignItems:'center', gap:8,
              background:'#050d1a', color:'#f59e0b', border:'none',
              padding:'12px 22px', borderRadius:12, fontFamily:'Inter,sans-serif',
              fontSize:13, fontWeight:700, cursor:'pointer',
              boxShadow:'0 4px 16px rgba(5,13,26,.2)', transition:'all .2s',
            }}
              onMouseOver={e => e.currentTarget.style.transform='translateY(-1px)'}
              onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}
            >View All →</button>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="re-card-grid">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ borderRadius:20, background:'#e5e7eb', height:380, animation:'hpulse 1.6s ease-in-out infinite', animationDelay:`${i*0.1}s` }} />
              ))}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="re-card-grid">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ padding:'clamp(48px,8vw,90px) clamp(16px,4vw,28px)', background:'#050d1a' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,6vw,80px)', alignItems:'center' }} className="re-why-grid">
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.18em', color:'#f59e0b', margin:'0 0 16px' }}>Our Commitment</p>
            <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, color:'#fff', margin:'0 0 44px', letterSpacing:'-.04em', lineHeight:1.1 }}>
              Redefining trust in<br/><span style={{ color:'rgba(255,255,255,.3)' }}>Indian Real Estate.</span>
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
              {WHY.map(item => (
                <div key={item.title} style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
                  <div style={{
                    width:50, height:50, borderRadius:14, flexShrink:0,
                    background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.2)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                  }}>{item.icon}</div>
                  <div>
                    <h4 style={{ fontSize:17, fontWeight:800, color:'#fff', margin:'0 0 6px' }}>{item.title}</h4>
                    <p style={{ fontSize:14, color:'rgba(255,255,255,.45)', margin:0, lineHeight:1.65 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:'relative' }}>
            <div style={{ borderRadius:24, overflow:'hidden', border:'3px solid rgba(245,158,11,.2)', boxShadow:'0 32px 80px rgba(0,0,0,.5)' }}>
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" alt="Premium Home"
                style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block' }} />
            </div>
            <div style={{
              position:'absolute', bottom:-20, left:-16,
              background:'rgba(5,13,26,.9)', backdropFilter:'blur(16px)',
              border:'1px solid rgba(245,158,11,.2)', borderRadius:18,
              padding:'16px 20px', boxShadow:'0 16px 50px rgba(0,0,0,.4)',
              display:'flex', gap:20,
            }}>
              {[['25k+','Properties'],['10k+','Verified Owners']].map(([v,l],i) => (
                <React.Fragment key={l}>
                  {i > 0 && <div style={{ width:1, background:'rgba(255,255,255,.08)' }} />}
                  <div>
                    <p style={{ fontSize:26, fontWeight:900, color:'#f59e0b', margin:'0 0 2px', letterSpacing:'-.03em' }}>{v}</p>
                    <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', textTransform:'uppercase', letterSpacing:'.1em', margin:0 }}>{l}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding:'0 clamp(16px,4vw,28px) clamp(60px,8vw,100px)', background:'#f9fafb' }}>
        <div style={{
          maxWidth:1200, margin:'0 auto',
          background:'linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #162952 100%)',
          borderRadius:28, padding:'clamp(36px,8vw,72px) clamp(20px,6vw,56px)', textAlign:'center',
          position:'relative', overflow:'hidden',
          boxShadow:'0 32px 80px rgba(5,13,26,.25)',
        }}>
          <div style={{ position:'absolute', top:-80, right:-80, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,158,11,.1), transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-60, left:-60, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,.08), transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.18em', color:'#f59e0b', margin:'0 0 16px' }}>For Property Owners</p>
            <h2 style={{ fontSize:42, fontWeight:900, color:'#fff', margin:'0 0 16px', letterSpacing:'-.04em', lineHeight:1.1 }}>
              Ready to list your property?
            </h2>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:17, margin:'0 0 40px', fontWeight:400 }}>
              Join 10,000+ owners who sold or rented through us — completely free.
            </p>
            <button onClick={() => navigate('/real-estate/post-property')} style={{
              background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#050d1a',
              border:'none', padding:'16px 44px', borderRadius:14,
              fontFamily:'Inter,sans-serif', fontWeight:800, fontSize:15, cursor:'pointer',
              boxShadow:'0 8px 32px rgba(245,158,11,.35)', transition:'all .22s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 40px rgba(245,158,11,.5)'; }}
              onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(245,158,11,.35)'; }}
            >Post Your Property — Free →</button>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes hpulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @media(max-width:1024px){.re-card-grid,.re-city-grid,.re-quick-grid{grid-template-columns:repeat(2,1fr)!important} .re-stats-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:720px){.re-why-grid{grid-template-columns:1fr!important;gap:40px!important}}
        @media(max-width:640px){
          .re-search-row{flex-direction:column!important}
          .re-search-row>*{width:100%!important}
          .re-card-grid,.re-city-grid,.re-quick-grid{grid-template-columns:repeat(2,1fr)!important}
        }
        @media(max-width:480px){
          .re-card-grid,.re-city-grid,.re-quick-grid,.re-stats-grid{grid-template-columns:1fr!important}
          .re-why-grid{grid-template-columns:1fr!important;gap:32px!important}
        }
      `}</style>
    </div>
  );
}
