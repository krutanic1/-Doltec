/* ─────────────────────────────────────────────────────
   src/real-estate/pages/Listing.jsx
   Filter sidebar + properties grid
───────────────────────────────────────────────────── */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProperties } from '../services/propertiesApi';
import PropertyCard from '../components/PropertyCard';

const BUDGETS = [
  { label: 'Any Budget', min: '', max: '' },
  { label: 'Under ₹50L',    min: '',         max: '5000000'  },
  { label: '₹50L – ₹1Cr',  min: '5000000',  max: '10000000' },
  { label: '₹1Cr – ₹3Cr',  min: '10000000', max: '30000000' },
  { label: '₹3Cr+',         min: '30000000', max: ''         },
];
const BHK_OPTIONS  = ['1', '2', '3', '4', '4+'];
const PROP_TYPES   = ['apartment', 'villa', 'plot', 'commercial'];
const FURNISHED    = ['furnished', 'semi-furnished', 'unfurnished'];
const POSTED_BY    = ['owner', 'agent'];

const S = {
  sidebar: { width: 260, flexShrink: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 20px', alignSelf: 'flex-start', position: 'sticky', top: 80 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14, marginTop: 24 },
  chip: (active) => ({
    padding: '6px 14px', borderRadius: 999, border: '1px solid',
    borderColor: active ? '#2563eb' : '#e2e8f0',
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#2563eb' : '#475569',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  }),
  checkRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', fontSize: 14, color: '#334155', fontWeight: 500 },
};

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
}

export default function Listing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount]       = useState(0);

  // Filters state
  const [type,       setType]       = useState(searchParams.get('type') || 'buy');
  const [budget,     setBudget]     = useState(0);
  const [bhk,        setBhk]        = useState([]);
  const [propTypes,  setPropTypes]  = useState([]);
  const [furnishing, setFurnishing] = useState([]);
  const [postedBy,   setPostedBy]   = useState([]);
  const [sort,       setSort]       = useState('newest');
  const city = searchParams.get('city') || '';
  const q    = searchParams.get('q')    || '';
  const cityLabel = city ? city.charAt(0).toUpperCase() + city.slice(1) : 'India';

  const fetchListings = async () => {
    setLoading(true); setError('');
    try {
      const params = { page, limit: 12, status: 'published' };
      if (city)    params.city   = city;
      if (q)       params.search = q;
      if (type && type !== 'all') params.type = type;
      if (propTypes.length === 1) params.category = propTypes[0];
      if (furnishing.length === 1) params.furnishing = furnishing[0];
      if (budget > 0) {
        const b = BUDGETS[budget];
        if (b.min) params.minPrice = b.min;
        if (b.max) params.maxPrice = b.max;
      }
      if (bhk.length) params.bhk = bhk.filter(b => b !== '4+').join(',') || undefined;
      if (sort === 'price_asc')  params.sort = 'price_asc';
      if (sort === 'price_desc') params.sort = 'price_desc';

      const res = await listProperties(params);
      const items = Array.isArray(res) ? res : res?.data || [];
      setProperties(items);
      setTotalPages(res?.totalPages || 1);
      setCount(res?.totalResults || res?.count || items.length);
    } catch {
      setError('Could not load listings. Please retry.');
      setProperties([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, [page, searchParams, type, budget, bhk, propTypes, furnishing, postedBy, sort]); // eslint-disable-line

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* ── Filter Bar (sticky) ───────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 12, height: 56, overflowX: 'auto' }}>
          {['buy','rent'].map(t => (
            <button key={t} onClick={() => { setType(t); setPage(1); }} style={S.chip(type === t)}>
              {t === 'buy' ? 'Buy' : 'Rent'}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />
          <select value={budget} onChange={e => { setBudget(Number(e.target.value)); setPage(1); }}
            style={{ border: '1px solid #e2e8f0', borderRadius: 999, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#475569', background: '#fff', cursor: 'pointer' }}>
            {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ border: '1px solid #e2e8f0', borderRadius: 999, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#475569', background: '#fff', cursor: 'pointer' }}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button onClick={() => { setBudget(0); setBhk([]); setPropTypes([]); setFurnishing([]); setPostedBy([]); setPage(1); }}
            style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto' }}>
            Reset ✕
          </button>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <aside style={S.sidebar}>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Filters</p>

          <p style={S.sectionTitle}>BHK</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BHK_OPTIONS.map(b => (
              <button key={b} onClick={() => setBhk(toggle(bhk, b))} style={S.chip(bhk.includes(b))}>{b} BHK</button>
            ))}
          </div>

          <p style={S.sectionTitle}>Property Type</p>
          {PROP_TYPES.map(t => (
            <label key={t} style={S.checkRow}>
              <input type="checkbox" checked={propTypes.includes(t)} onChange={() => setPropTypes(toggle(propTypes, t))} />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}

          <p style={S.sectionTitle}>Furnishing</p>
          {FURNISHED.map(f => (
            <label key={f} style={S.checkRow}>
              <input type="checkbox" checked={furnishing.includes(f)} onChange={() => setFurnishing(toggle(furnishing, f))} />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
          ))}

          <p style={S.sectionTitle}>Posted By</p>
          {POSTED_BY.map(pb => (
            <label key={pb} style={S.checkRow}>
              <input type="checkbox" checked={postedBy.includes(pb)} onChange={() => setPostedBy(toggle(postedBy, pb))} />
              {pb.charAt(0).toUpperCase() + pb.slice(1)}
            </label>
          ))}
        </aside>

        {/* Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
                {loading ? 'Searching...' : `${count > 0 ? count : 'No'} Properties in ${cityLabel}`}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Verified</span>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '24px 32px', textAlign: 'center', marginBottom: 24 }}>
              <p style={{ color: '#991b1b', fontWeight: 600, marginBottom: 12 }}>{error}</p>
              <button onClick={fetchListings} style={{ padding: '8px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '16/10', background: '#e2e8f0' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6, marginBottom: 10, width: '40%' }} />
                    <div style={{ height: 18, background: '#e2e8f0', borderRadius: 6, marginBottom: 20 }} />
                    <div style={{ height: 36, background: '#f1f5f9', borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 48 }}>
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                    style={{ width: 42, height: 42, border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 20, opacity: page <= 1 ? 0.3 : 1 }}>‹</button>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Page {page} / {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                    style={{ width: 42, height: 42, border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 20, opacity: page >= totalPages ? 0.3 : 1 }}>›</button>
                </div>
              )}
            </>
          ) : !error && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>No properties found in {cityLabel}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>Try adjusting your filters or browsing all of India.</p>
              <button onClick={() => { setSearchParams({}); setBudget(0); setBhk([]); setPropTypes([]); }}
                style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Browse All India
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
