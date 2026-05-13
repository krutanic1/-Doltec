'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import clsx from 'clsx';

const TABS = [
  { label: 'Buy', intent: 'BUY', segment: 'RESIDENTIAL' },
  { label: 'Rent', intent: 'RENT', segment: 'RESIDENTIAL' },
  { label: 'Commercial', intent: 'BUY', segment: 'COMMERCIAL' },
  { label: 'New Launch', intent: 'BUY', segment: 'RESIDENTIAL' },
];

export default function SearchModule() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSug, setShowSug] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const { data } = await api.get(`/search/autocomplete?q=${query}`);
          setSuggestions(data);
          setShowSug(data.length > 0);
        } catch (err) {
          console.error('Autocomplete error', err);
        }
      } else {
        setShowSug(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e?: React.FormEvent, selectedQ?: string) => {
    e?.preventDefault();
    const finalQ = selectedQ || query;
    const p = new URLSearchParams();
    p.set('intent', activeTab.intent);
    p.set('segment', activeTab.segment);
    if (finalQ) p.set('city', finalQ); // Simplified for demo
    router.push(`/properties?${p}`);
    setShowSug(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-slate-900/30 border border-white/20 p-2 overflow-hidden max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 mb-2">
        {TABS.map(t => (
          <button key={t.label} type="button" onClick={() => setActiveTab(t)}
            className={clsx('px-8 py-4 text-xs font-black uppercase tracking-widest rounded-[32px] transition-all',
              activeTab.label === t.label ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 p-2">
        <div className="relative flex-1 w-full">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-5 group focus-within:border-blue-400 focus-within:bg-white transition-all">
            <span className="text-xl">🔍</span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              onBlur={() => setTimeout(() => setShowSug(false), 200)}
              placeholder="Search by City, Locality or Project..."
              className="flex-1 outline-none text-base font-bold text-slate-900 placeholder:text-slate-400 bg-transparent" />
          </div>
          
          {/* Autocomplete Dropdown */}
          {showSug && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-[32px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggestions</p>
               </div>
               <ul className="divide-y divide-slate-50">
                {suggestions.map(s => (
                  <li key={s.id} onClick={() => handleSearch(undefined, s.location?.city)}
                    className="px-8 py-5 hover:bg-blue-50 cursor-pointer flex items-center gap-4 transition-colors">
                    <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">📍</span>
                    <div>
                       <p className="font-black text-slate-900 text-sm">{s.title}</p>
                       <p className="text-xs font-bold text-slate-400">{s.location?.locality}, {s.location?.city}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-12 py-5 rounded-[32px] transition-all shadow-xl shadow-blue-200 active:scale-95">
          Search Properties
        </button>
      </form>
    </div>
  );
}
