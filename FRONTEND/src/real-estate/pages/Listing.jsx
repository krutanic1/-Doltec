import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listProperties } from '../services/propertiesApi';
import PropertyCard from '../components/PropertyCard';
import MarketIntelligenceSidebar from '../components/MarketIntelligenceSidebar';
import CompareBar from '../components/CompareBar';
import EmptyState from '../components/EmptyState';
import {
  INTENT_OPTIONS, SEGMENT_OPTIONS, PROPERTY_TYPE_OPTIONS,
  BHK_OPTIONS, BUDGET_SLABS, POSSESSION_OPTIONS,
  AMENITIES_OPTIONS, ALL_PROPERTY_TYPES,
} from '../constants/filterOptions';

const S = {
  font: 'Inter,sans-serif',
  label: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8', display: 'block', marginBottom: 8 },
  chip: (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 30,
    border: `1.5px solid ${active ? '#2563eb' : '#e2e8f0'}`,
    background: active ? '#2563eb' : '#fff',
    color: active ? '#fff' : '#475569',
    fontSize: 12, fontWeight: 700, cursor: 'pointer',
    whiteSpace: 'nowrap', fontFamily: 'Inter,sans-serif',
    transition: 'all .15s',
  }),
  sideLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#94a3b8', marginBottom: 10, display: 'block' },
};

function FilterSection({ title, children }) {
  return (
    <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
      <p style={S.sideLabel}>{title}</p>
      {children}
    </div>
  );
}

export default function Listing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [count, setCount]             = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedCompare, setSelectedCompare]   = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState('');

  const [filters, setFilters] = useState({
    intent: searchParams.get('intent') || 'BUY',
    segment: searchParams.get('segment') || 'RESIDENTIAL',
    propertyType: searchParams.get('propertyType') || '',
    bhk: searchParams.get('bhk') || '',
    budget: searchParams.get('budget') || '',
    possession: searchParams.get('possession') || '',
    postedBy: searchParams.get('postedBy') || '',
    furnishing: searchParams.get('furnishing') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
  });

  const city = searchParams.get('city') || '';
  const q    = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'newest';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';
  const radius = searchParams.get('radius') || '';
  const isNearbyActive = Boolean(lat && lng && radius);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const p = new URLSearchParams(searchParams);
    if (value && (!Array.isArray(value) || value.length > 0)) {
      p.set(key, Array.isArray(value) ? value.join(',') : value);
    } else { p.delete(key); }
    setSearchParams(p);
  };

  const toggleAmenity = (val) => {
    const curr = filters.amenities;
    updateFilter('amenities', curr.includes(val) ? curr.filter(x => x !== val) : [...curr, val]);
  };

  const clearAll = () => {
    const reset = { intent: 'BUY', segment: 'RESIDENTIAL', propertyType: '', bhk: '', budget: '', possession: '', postedBy: '', furnishing: '', amenities: [] };
    setFilters(reset);
    setSearchParams({ intent: 'BUY', segment: 'RESIDENTIAL' });
  };

  const toggleNearbySearch = () => {
    if (isNearbyActive) {
      const next = new URLSearchParams(searchParams);
      next.delete('lat');
      next.delete('lng');
      next.delete('radius');
      setNearbyError('');
      setSearchParams(next);
      return;
    }

    if (!navigator.geolocation) {
      setNearbyError('Your browser does not support location access.');
      return;
    }

    setNearbyLoading(true);
    setNearbyError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = new URLSearchParams(searchParams);
        next.set('lat', String(position.coords.latitude));
        next.set('lng', String(position.coords.longitude));
        next.set('radius', '10');
        setSearchParams(next);
        setNearbyLoading(false);
      },
      () => {
        setNearbyLoading(false);
        setNearbyError('Unable to access your location. Please allow location permission and try again.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchListings = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = { ...filters, sort };
      if (city) params.city = city;
      if (q)    params.q    = q;
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
        params.radius = radius || '10';
      }
      if (filters.budget) {
        const slab = BUDGET_SLABS[filters.intent]?.find(s => s.label === filters.budget);
        if (slab) { params.minPrice = slab.min; params.maxPrice = slab.max; }
      }
      const res = await listProperties(params);
      const items = Array.isArray(res) ? res : res?.data || [];
      setProperties(items);
      setCount(res?.totalResults || res?.count || items.length);
    } catch { setError('Failed to load properties. Please try again.'); setProperties([]); }
    finally { setLoading(false); }
  }, [filters, city, q, sort, lat, lng, radius]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleCompare = (p) => {
    if (selectedCompare.find(x => x._id === p._id)) setSelectedCompare(prev => prev.filter(x => x._id !== p._id));
    else if (selectedCompare.length < 3) setSelectedCompare(prev => [...prev, p]);
  };

  const activeCount = Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : v !== 'BUY' && v !== 'RESIDENTIAL')).length;

  const FilterSidebar = () => (
    <aside style={{ fontFamily: S.font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '.08em' }}>Filters</span>
        <button onClick={clearAll} style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>Clear All</button>
      </div>

      {/* Intent */}
      <FilterSection title="Looking For">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {INTENT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => updateFilter('intent', o.value)} style={S.chip(filters.intent === o.value)}>{o.label}</button>
          ))}
        </div>
      </FilterSection>

      {/* Segment */}
      <FilterSection title="Segment">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SEGMENT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => updateFilter('segment', o.value)} style={S.chip(filters.segment === o.value)}>{o.label}</button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <select
          value={filters.propertyType}
          onChange={e => updateFilter('propertyType', e.target.value)}
          style={{
            width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
            borderRadius: 10, padding: '10px 14px', fontFamily: S.font,
            fontSize: 13, fontWeight: 600, color: '#334155', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">Any Type</option>
          {(PROPERTY_TYPE_OPTIONS[filters.segment] || ALL_PROPERTY_TYPES).map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(BUDGET_SLABS[filters.intent] || []).map(slab => (
            <button key={slab.label} onClick={() => updateFilter('budget', filters.budget === slab.label ? '' : slab.label)}
              style={{
                textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                border: `1.5px solid ${filters.budget === slab.label ? '#2563eb' : '#e2e8f0'}`,
                background: filters.budget === slab.label ? '#eff6ff' : '#fff',
                color: filters.budget === slab.label ? '#2563eb' : '#475569',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font, transition: 'all .15s',
              }}
            >{slab.label}</button>
          ))}
        </div>
      </FilterSection>

      {/* BHK */}
      <FilterSection title="Configuration">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
          {BHK_OPTIONS.map(o => (
            <button key={o.value} onClick={() => updateFilter('bhk', filters.bhk === o.value ? '' : o.value)}
              style={{
                padding: '9px 8px', borderRadius: 9, border: `1.5px solid ${filters.bhk === o.value ? '#0f172a' : '#e2e8f0'}`,
                background: filters.bhk === o.value ? '#0f172a' : '#fff',
                color: filters.bhk === o.value ? '#fff' : '#475569',
                fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: S.font, transition: 'all .15s',
              }}
            >{o.label}</button>
          ))}
        </div>
      </FilterSection>

      {/* Possession */}
      <FilterSection title="Possession">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {POSSESSION_OPTIONS.map(o => (
            <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              onClick={() => updateFilter('possession', o.value)}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${filters.possession === o.value ? '#2563eb' : '#cbd5e1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {filters.possession === o.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{o.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AMENITIES_OPTIONS.slice(0, 8).map(o => (
            <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              onClick={() => toggleAmenity(o.value)}>
              <div style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${filters.amenities.includes(o.value) ? '#2563eb' : '#cbd5e1'}`,
                background: filters.amenities.includes(o.value) ? '#2563eb' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {filters.amenities.includes(o.value) && <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{o.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: S.font }}>

      {/* ── Control Bar ──────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 68, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(0,0,0,.05)',
      }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 14px' }}>
            <svg width="15" height="15" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder={`Search in ${city}…`}
              defaultValue={q}
              onChange={e => { const p = new URLSearchParams(searchParams); if (e.target.value) p.set('q', e.target.value); else p.delete('q'); setSearchParams(p); }}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: S.font, fontSize: 13, fontWeight: 500, color: '#334155', padding: '11px 0', flex: 1 }}
            />
            <button
              type="button"
              onClick={toggleNearbySearch}
              disabled={nearbyLoading}
              title={isNearbyActive ? 'Clear nearby search' : 'Search within 10 km of your current location'}
              aria-label={isNearbyActive ? 'Clear nearby search' : 'Search within 10 km of your current location'}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `1.5px solid ${isNearbyActive ? '#2563eb' : '#e2e8f0'}`,
                background: isNearbyActive ? '#eff6ff' : '#fff',
                color: isNearbyActive ? '#2563eb' : '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                cursor: nearbyLoading ? 'wait' : 'pointer',
                transition: 'all .15s',
              }}
            >
              {nearbyLoading ? (
                <span style={{ fontSize: 14, fontWeight: 800 }}>…</span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>

          {/* Intent chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }} className="re-no-scrollbar">
            {INTENT_OPTIONS.map(o => (
              <button key={o.value} onClick={() => updateFilter('intent', o.value)} style={S.chip(filters.intent === o.value)}>{o.label}</button>
            ))}
          </div>

          <div style={{ width: 1, height: 24, background: '#e2e8f0', flexShrink: 0 }} />

          {/* Mobile filter toggle */}
          <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
            borderRadius: 10, border: `1.5px solid ${activeCount > 0 ? '#2563eb' : '#e2e8f0'}`,
            background: activeCount > 0 ? '#eff6ff' : '#fff',
            color: activeCount > 0 ? '#2563eb' : '#475569',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>

          {/* Sort */}
          <select value={sort}
            onChange={e => { const p = new URLSearchParams(searchParams); p.set('sort', e.target.value); setSearchParams(p); }}
            style={{
              border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 14px',
              fontFamily: S.font, fontSize: 12, fontWeight: 700, color: '#334155',
              background: '#fff', outline: 'none', cursor: 'pointer',
            }}>
            <option value="newest">Latest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {activeCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px' }}>Reset</button>
          )}
        </div>
      </div>

      {nearbyError && (
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginTop: 12, background: '#fff5f5', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 600 }}>
            {nearbyError}
          </div>
        </div>
      )}

      {/* ── Main 3-Column Grid ───────────────────────────── */}
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '32px 24px 80px', display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 28, alignItems: 'start' }} className="re-listing-grid">

        {/* Left: Filter Rail */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px 20px', position: 'sticky', top: 130 }}>
          <FilterSidebar />
        </div>

        {/* Center: Results */}
        <main>
          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-.02em' }}>
                {loading ? 'Searching…' : `${count.toLocaleString()} Properties in ${city || 'All India'}`}
              </h1>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: '#d1fae5', padding: '3px 10px', borderRadius: 30, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />99% Trust Accuracy
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '3px 10px', borderRadius: 30 }}>Updated 2 mins ago</span>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {Object.entries(filters).map(([key, val]) => {
                if (!val || val === 'BUY' || val === 'RESIDENTIAL' || (Array.isArray(val) && val.length === 0)) return null;
                const labels = Array.isArray(val) ? val : [val];
                return labels.map(l => (
                  <button key={l} onClick={() => Array.isArray(val) ? toggleAmenity(l) : updateFilter(key, '')} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 30,
                    background: '#0f172a', color: '#fff',
                    border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
                  }}>
                    {l.replace(/_/g, ' ')}
                    <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                ));
              })}
            </div>
          )}

          {/* Grid */}
          {error ? (
            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <p style={{ color: '#991b1b', fontWeight: 700, marginBottom: 16 }}>{error}</p>
              <button onClick={fetchListings} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>Retry</button>
            </div>
          ) : loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: '#e2e8f0', borderRadius: 18, height: 360, animation: 'shimmer 1.4s infinite' }} />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }} className="re-props-grid">
              {properties.map(p => (
                <PropertyCard key={p._id} property={p} onCompare={handleCompare} isComparing={selectedCompare.some(x => x._id === p._id)} />
              ))}
            </div>
          ) : (
            <EmptyState clearFilters={clearAll} />
          )}
        </main>

        {/* Right: Market Sidebar */}
        <MarketIntelligenceSidebar city={city} />
      </div>

      <CompareBar
        selectedProperties={selectedCompare}
        onRemove={id => setSelectedCompare(prev => prev.filter(x => x._id !== id))}
        onClear={() => setSelectedCompare([])}
        onCompare={() => console.log('Comparing:', selectedCompare)}
      />

      {/* Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <>
          <div onClick={() => setMobileFilterOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 300 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderRadius: '20px 20px 0 0', zIndex: 301,
            maxHeight: '85vh', overflowY: 'auto', padding: '24px 20px 40px',
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#e2e8f0', margin: '0 auto 20px' }} />
            <FilterSidebar />
            <button onClick={() => setMobileFilterOpen(false)} style={{
              width: '100%', padding: '14px', background: '#2563eb', color: '#fff',
              border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: S.font,
            }}>Apply Filters</button>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer { 0%,100%{opacity:.7}50%{opacity:.4} }
        .re-no-scrollbar{scrollbar-width:none}.re-no-scrollbar::-webkit-scrollbar{display:none}
        @media(max-width:1100px){.re-listing-grid{grid-template-columns:220px 1fr !important}}
        @media(max-width:900px){.re-listing-grid{grid-template-columns:1fr !important} .re-listing-grid>:first-child{display:none} .re-listing-grid>:last-child{display:none}}
        @media(max-width:640px){.re-props-grid{grid-template-columns:1fr !important}}
      `}</style>
    </div>
  );
}
