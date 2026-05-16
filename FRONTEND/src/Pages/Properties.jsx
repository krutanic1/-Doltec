import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  INTENT_OPTIONS, 
  SEGMENT_OPTIONS, 
  PROPERTY_TYPE_OPTIONS, 
  BHK_OPTIONS, 
  BUDGET_SLABS,
} from '../real-estate/constants/filterOptions';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    intent: searchParams.get('intent') || 'BUY',
    segment: searchParams.get('segment') || 'RESIDENTIAL',
    propertyType: searchParams.get('propertyType') || '',
    bhk: searchParams.get('bhk') || '',
    budget: searchParams.get('budget') || '',
    possession: searchParams.get('possession') || '',
    furnishing: searchParams.get('furnishing') || '',
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (filters.budget) {
        const slab = BUDGET_SLABS[filters.intent]?.find(s => s.label === filters.budget);
        if (slab) {
          params.minPrice = slab.min;
          params.maxPrice = slab.max;
        }
      }

      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`http://localhost:5000/api/v1/properties?${query}`);
      setProperties(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearAll = () => {
    const reset = { intent: 'BUY', segment: 'RESIDENTIAL', propertyType: '', bhk: '', budget: '', possession: '', furnishing: '' };
    setFilters(reset);
    setSearchParams({ intent: 'BUY', segment: 'RESIDENTIAL' });
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      {/* Search Header Section */}
      <section className="border-b border-slate-100 bg-slate-50/50 py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-slate-900">Real Estate</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Properties for {filters.intent === 'BUY' ? 'Sale' : 'Rent'}</h1>
              <p className="text-slate-500 mt-2 font-medium">Discover premium listings tailored to your lifestyle</p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 w-full md:w-auto max-w-md">
              <span className="pl-4 text-slate-400">🔍</span>
              <input 
                type="text" 
                value={filters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Search city, locality or project..." 
                className="flex-1 py-2 outline-none font-semibold text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Modern Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0">
          <div className="sticky top-32 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Filter Results
              </h2>
              <button onClick={clearAll} className="text-xs font-bold text-blue-600 hover:underline">Reset All</button>
            </div>

            {/* Intent Selector */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              {INTENT_OPTIONS.map(opt => (
                <button 
                  key={opt.value} 
                  onClick={() => updateFilter('intent', opt.value)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${filters.intent === opt.value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Segment Selector */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Property Segment</label>
              <div className="grid grid-cols-1 gap-2">
                {SEGMENT_OPTIONS.map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => updateFilter('segment', opt.value)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${filters.segment === opt.value ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-slate-200'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type Selector */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
              <select 
                value={filters.propertyType} 
                onChange={e => updateFilter('propertyType', e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all"
              >
                <option value="">Any Type</option>
                {(PROPERTY_TYPE_OPTIONS[filters.segment] || []).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            {/* BHK Selector */}
            {filters.segment === 'RESIDENTIAL' && (
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">BHK Configuration</label>
                <div className="grid grid-cols-3 gap-2">
                  {BHK_OPTIONS.map(opt => (
                    <button 
                      key={opt.value} 
                      onClick={() => updateFilter('bhk', filters.bhk === opt.value ? '' : opt.value)}
                      className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${filters.bhk === opt.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                    >
                      {opt.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Range */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Budget</label>
              <select 
                value={filters.budget} 
                onChange={e => updateFilter('budget', e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-xl text-sm font-bold outline-none focus:border-blue-600 transition-all"
              >
                <option value="">Any Budget</option>
                {(BUDGET_SLABS[filters.intent] || []).map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-500">Showing <span className="text-slate-900">{properties.length}</span> properties</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Sort by:</span>
              <select className="text-xs font-bold bg-transparent outline-none cursor-pointer">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
              {[1, 2, 4].map(n => (
                <div key={n} className="bg-slate-50 rounded-3xl h-[400px]"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-6 opacity-40">🏠</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties found</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">Try adjusting your filters or search criteria to find matching results.</p>
              <button onClick={clearAll} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {properties.map(p => (
                <Link key={p._id} to={`/real-estate/properties/${p.slug}`} className="group block bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    {p.media?.[0] ? (
                      <img src={p.media[0].url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">🏢</div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">{p.filters?.intent || p.intent}</span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-lg">
                      ₹{p.price?.toLocaleString() || p.pricing?.amount?.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                      <span className="text-base opacity-60">📍</span> {p.locality || p.location?.locality}, {p.city || p.location?.city}
                    </p>
                    <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex-1 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">BHK</p>
                        <p className="text-xs font-bold text-slate-800">{p.filters?.bhk?.replace(/_BHK/g, '') || p.features?.bhk || '—'}</p>
                      </div>
                      <div className="w-px bg-slate-200"></div>
                      <div className="flex-1 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Type</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{p.filters?.propertyType?.replace(/_/g, ' ') || p.propertyType || '—'}</p>
                      </div>
                      <div className="w-px bg-slate-200"></div>
                      <div className="flex-1 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Status</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{p.filters?.possession?.replace(/_/g, ' ') || '—'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
