import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { listProperties, listCities, listSavedProperties, saveProperty, unsaveProperty } from '../services/propertiesApi';
import PropertyCard from '../components/PropertyCard';
import MarketIntelligenceSidebar from '../components/MarketIntelligenceSidebar';
import CompareBar from '../components/CompareBar';
import EmptyState from '../components/EmptyState';
import CustomSelect from '../components/CustomSelect';
import {
  INTENT_OPTIONS, SEGMENT_OPTIONS, PROPERTY_TYPE_OPTIONS,
  BHK_OPTIONS, BUDGET_SLABS, POSSESSION_OPTIONS,
  AMENITIES_OPTIONS, ALL_PROPERTY_TYPES,
} from '../constants/filterOptions';

const SORT_OPTIONS = [
  { label: 'Latest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const S = {
  font: 'Inter,sans-serif',
  label: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#9ca3af', display: 'block', marginBottom: 8 },
  chip: (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', borderRadius: 30,
    border: `1.5px solid ${active ? '#050d1a' : '#e5e7eb'}`,
    background: active ? '#050d1a' : '#fff',
    color: active ? '#f59e0b' : '#4b5563',
    fontSize: 12, fontWeight: 700, cursor: 'pointer',
    whiteSpace: 'nowrap', fontFamily: 'Inter,sans-serif',
    transition: 'all .18s',
  }),
  sideLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: '#9ca3af', marginBottom: 10, display: 'block' },
};

function FilterSection({ title, children }) {
  return (
    <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #f3f4f6' }}>
      <p style={S.sideLabel}>{title}</p>
      {children}
    </div>
  );
}

export default function Listing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [count, setCount]             = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedCompare, setSelectedCompare]   = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    listCities().then(setCityOptions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) return;

    listSavedProperties()
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        setSavedIds(items.map((item) => item._id).filter(Boolean));
      })
      .catch(() => setSavedIds([]));
  }, []);

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
  const nearbyRadius = radius || '10';
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
        next.set('radius', nearbyRadius);
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

  const handleToggleSave = async (property) => {
    if (!localStorage.getItem('token')) {
      navigate('/real-estate/login');
      return;
    }

    const isSaved = savedIds.includes(property._id);
    try {
      if (isSaved) {
        await unsaveProperty(property._id);
        setSavedIds((current) => current.filter((id) => id !== property._id));
      } else {
        await saveProperty(property._id);
        setSavedIds((current) => [...current, property._id]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/real-estate/login');
      } else {
        console.error('Failed to update saved properties:', err);
      }
    }
  };

  const activeCount = Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : v !== 'BUY' && v !== 'RESIDENTIAL')).length;

  const FilterSidebar = () => (
    <aside style={{ fontFamily: S.font }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#0a1628', textTransform: 'uppercase', letterSpacing: '.1em' }}>Filters</span>
        <button onClick={clearAll} style={{ fontSize: 11, fontWeight: 700, color: '#d97706', background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', cursor: 'pointer', padding: '4px 10px', borderRadius: 6 }}>Clear All</button>
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

      <FilterSection title="Nearby Radius">
        <div style={{ paddingTop: 2 }}>
          <div style={{ position: 'relative', padding: '14px 0 8px' }}>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={Number(nearbyRadius)}
              onChange={e => {
                const next = new URLSearchParams(searchParams);
                next.set('radius', e.target.value);
                setSearchParams(next);
              }}
              className="re-radius-slider"
              aria-label="Nearby radius"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>3 km</span>
            <span style={{ fontSize: 12, color: '#334155', fontWeight: 800 }}>{nearbyRadius} km</span>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>20 km</span>
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type">
        <CustomSelect
          value={filters.propertyType}
          onChange={e => updateFilter('propertyType', e.target.value)}
          options={[
            { label: 'Any Type', value: '' },
            ...(PROPERTY_TYPE_OPTIONS[filters.segment] || ALL_PROPERTY_TYPES)
          ]}
        />
      </FilterSection>

      {/* Budget */}
      <FilterSection title="Budget Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(BUDGET_SLABS[filters.intent] || []).map(slab => (
            <button key={slab.label} onClick={() => updateFilter('budget', filters.budget === slab.label ? '' : slab.label)}
              style={{
                textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                border: `1.5px solid ${filters.budget === slab.label ? '#f59e0b' : '#e5e7eb'}`,
                background: filters.budget === slab.label ? 'rgba(245,158,11,.08)' : '#fff',
                color: filters.budget === slab.label ? '#d97706' : '#4b5563',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font, transition: 'all .18s',
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
                padding: '9px 8px', borderRadius: 9,
                border: `1.5px solid ${filters.bhk === o.value ? '#050d1a' : '#e5e7eb'}`,
                background: filters.bhk === o.value ? '#050d1a' : '#fff',
                color: filters.bhk === o.value ? '#f59e0b' : '#4b5563',
                fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: S.font, transition: 'all .18s',
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
                border: `2px solid ${filters.possession === o.value ? '#f59e0b' : '#d1d5db'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {filters.possession === o.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{o.label}</span>
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
                border: `2px solid ${filters.amenities.includes(o.value) ? '#f59e0b' : '#d1d5db'}`,
                background: filters.amenities.includes(o.value) ? '#f59e0b' : 'transparent',
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
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: S.font }}>

      {/* ── Control Bar ──────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 72, zIndex: 100,
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 16px rgba(0,0,0,.06)',
      }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          
          {/* City Autocomplete */}
          <div style={{ position: 'relative', width: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 14px' }}>
              <svg width="15" height="15" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <input 
                type="text" 
                placeholder="Select City"
                value={showCityDropdown ? cityInput : (city || '')}
                onChange={e => { setCityInput(e.target.value); setShowCityDropdown(true); }}
                onFocus={() => { setCityInput(city); setShowCityDropdown(true); }}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: S.font, fontSize: 13, fontWeight: 700, color: '#0f172a', padding: '11px 0', width: '100%' }}
              />
            </div>
            
            {showCityDropdown && (
              <div style={{
                position: 'absolute', top: '105%', left: 0, right: 0, 
                background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px rgba(0,0,0,.1)', zIndex: 1000,
                maxHeight: 240, overflowY: 'auto', padding: '8px 0'
              }}>
                <div style={{ padding: '6px 14px', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em' }}>Registered Cities</div>
                {['All Cities', ...cityOptions].filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).map(c => (
                  <div key={c} 
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      if (c === 'All Cities') p.delete('city'); else p.set('city', c);
                      setSearchParams(p);
                      setShowCityDropdown(false);
                      setCityInput('');
                    }}
                    style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer', transition: 'background .15s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >{c}</div>
                ))}
              </div>
            )}
            {showCityDropdown && <div onClick={() => setShowCityDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />}
          </div>

          {/* Search Query */}
          <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0 14px' }}>
            <svg width="15" height="15" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text" placeholder={`Search properties, builders or projects…`}
              defaultValue={q}
              onChange={e => { const p = new URLSearchParams(searchParams); if (e.target.value) p.set('q', e.target.value); else p.delete('q'); setSearchParams(p); }}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: S.font, fontSize: 13, fontWeight: 500, color: '#334155', padding: '11px 0', flex: 1 }}
            />
            <button
              type="button"
              onClick={toggleNearbySearch}
              disabled={nearbyLoading}
              title={isNearbyActive ? 'Clear nearby search' : `Search within ${nearbyRadius} km of your current location`}
              aria-label={isNearbyActive ? 'Clear nearby search' : `Search within ${nearbyRadius} km of your current location`}
              style={{
                width: 38, height: 38, borderRadius: 10,
                border: `1.5px solid ${isNearbyActive ? '#f59e0b' : '#e5e7eb'}`,
                background: isNearbyActive ? 'rgba(245,158,11,.08)' : '#fff',
                color: isNearbyActive ? '#d97706' : '#6b7280',
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
            borderRadius: 10, border: `1.5px solid ${activeCount > 0 ? '#050d1a' : '#e5e7eb'}`,
            background: activeCount > 0 ? '#050d1a' : '#fff',
            color: activeCount > 0 ? '#f59e0b' : '#4b5563',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>

          {/* Sort */}
          <div style={{ minWidth: 160 }}>
            <CustomSelect
              value={sort}
              onChange={e => { const p = new URLSearchParams(searchParams); p.set('sort', e.target.value); setSearchParams(p); }}
              options={SORT_OPTIONS}
              style={{ fontSize: 12 }}
            />
          </div>

          {activeCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px' }}>Reset</button>
          )}
        </div>
      </div>

      {lat && lng && radius && (
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', background: '#050d1a', padding: '4px 10px', borderRadius: 30, border: '1px solid rgba(245,158,11,.25)' }}>
              Nearby: {radius} km
            </span>
            <button
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('lat');
                next.delete('lng');
                next.delete('radius');
                setSearchParams(next);
              }}
              style={{ fontSize: 11, fontWeight: 700, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
            >
              Clear nearby
            </button>
          </div>
        </div>
      )}

      {nearbyError && (
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginTop: 12, background: '#fff5f5', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 600 }}>
            {nearbyError}
          </div>
        </div>
      )}

      {/* ── Main 3-Column Grid ───────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 28px 100px', display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 28, alignItems: 'start' }} className="re-listing-grid">

        {/* Left: Filter Rail */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', padding: '24px 20px', position: 'sticky', top: 140, boxShadow: '0 4px 24px rgba(0,0,0,.05)' }}>
          <FilterSidebar />
        </div>

        {/* Center: Results */}
        <main>
          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0a1628', margin: '0 0 4px', letterSpacing: '-.03em' }}>
                {loading ? 'Searching…' : `${count.toLocaleString()} Properties`}
              </h1>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, fontWeight: 500 }}>in {city || 'All India'}</p>
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
                    background: '#050d1a', color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,.2)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: S.font,
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
              <button onClick={fetchListings} style={{ background: '#050d1a', color: '#f59e0b', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>Retry</button>
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
                <PropertyCard
                  key={p._id}
                  property={p}
                  onCompare={handleCompare}
                  isComparing={selectedCompare.some(x => x._id === p._id)}
                  isSaved={savedIds.includes(p._id)}
                  onToggleSave={handleToggleSave}
                />
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
        onCompare={() => {
          const slugs = selectedCompare.map((item) => item.slug).filter(Boolean).join(',');
          if (slugs) {
            navigate(`/real-estate/compare?slugs=${encodeURIComponent(slugs)}`);
          }
        }}
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
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#050d1a',
              border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: S.font,
            }}>Apply Filters →</button>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer { 0%,100%{opacity:.7}50%{opacity:.4} }
        .re-no-scrollbar{scrollbar-width:none}.re-no-scrollbar::-webkit-scrollbar{display:none}
        .re-radius-slider{
          width:100%;
          appearance:none;
          -webkit-appearance:none;
          height:8px;
          border-radius:999px;
          background:linear-gradient(to right, #2563eb 0%, #2563eb ${((Number(nearbyRadius) - 3) / 17) * 100}%, #dbe4f0 ${((Number(nearbyRadius) - 3) / 17) * 100}%, #dbe4f0 100%);
          outline:none;
        }
        .re-radius-slider::-webkit-slider-thumb{
          -webkit-appearance:none;
          appearance:none;
          width:22px;
          height:22px;
          border-radius:50%;
          background:#2563eb;
          border:4px solid #fff;
          box-shadow:0 4px 12px rgba(37,99,235,.28);
          cursor:pointer;
        }
        .re-radius-slider::-moz-range-thumb{
          width:22px;
          height:22px;
          border-radius:50%;
          background:#2563eb;
          border:4px solid #fff;
          box-shadow:0 4px 12px rgba(37,99,235,.28);
          cursor:pointer;
        }
        .re-radius-slider::-moz-range-track{
          height:8px;
          border-radius:999px;
          background:#dbe4f0;
        }
        @media(max-width:1100px){.re-listing-grid{grid-template-columns:220px 1fr !important}}
        @media(max-width:900px){.re-listing-grid{grid-template-columns:1fr !important} .re-listing-grid>:first-child{display:none} .re-listing-grid>:last-child{display:none}}
        @media(max-width:640px){
          .re-props-grid{grid-template-columns:1fr !important}
          div[style*="padding: '32px 24px 80px'"] { padding: 20px 16px 60px !important; }
        }
      `}</style>
    </div>
  );
}
