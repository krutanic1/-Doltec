'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import clsx from 'clsx';

const INTENTS = [{ label: 'Buy', value: 'BUY' }, { label: 'Rent', value: 'RENT' }];
const SEGMENTS = [{ label: 'Residential', value: 'RESIDENTIAL' }, { label: 'Commercial', value: 'COMMERCIAL' }];
const BHK_OPTS = ['1', '2', '3', '4', '5'];
const POSTER_TYPES = [{ label: 'Owner', value: 'OWNER' }, { label: 'Agent', value: 'AGENT' }, { label: 'Builder', value: 'BUILDER' }];
const AMENITIES = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Club House', 'Power Backup'];

const BUDGETS = [
  { label: 'Any Budget', min: '', max: '' },
  { label: 'Below 50L', min: '0', max: '5000000' },
  { label: '50L - 1Cr', min: '5000000', max: '10000000' },
  { label: '1Cr - 2Cr', min: '10000000', max: '20000000' },
  { label: '2Cr - 5Cr', min: '20000000', max: '50000000' },
  { label: 'Above 5Cr', min: '50000000', max: '' },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-4">{children}</p>;
}

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    router.push(`/properties?${p}`, { scroll: false });
  }, [params, router]);

  const toggle = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    const existing = p.get(key)?.split(',').filter(Boolean) || [];
    const next = existing.includes(value) ? existing.filter(v => v !== value) : [...existing, value];
    if (next.length) p.set(key, next.join(',')); else p.delete(key);
    p.delete('page');
    router.push(`/properties?${p}`, { scroll: false });
  }, [params, router]);

  const reset = () => router.push('/properties');

  const activeIntent = params.get('intent') || 'BUY';
  const activeSegment = params.get('segment') || 'RESIDENTIAL';
  const activeBhk = params.get('bhk')?.split(',') || [];
  const activePosters = params.get('posterType')?.split(',') || [];
  const activeAmenities = params.get('amenities')?.split(',') || [];
  const minP = params.get('minPrice') || '';
  const maxP = params.get('maxPrice') || '';

  return (
    <aside className="w-72 shrink-0 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm self-start sticky top-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-black text-slate-900 text-lg">Filters</h2>
        <button onClick={reset} className="text-xs font-bold text-blue-600 hover:underline">Clear all</button>
      </div>

      {/* Intent Selector */}
      <div className="flex p-1 bg-slate-50 rounded-2xl mt-6">
        {INTENTS.map(i => (
          <button key={i.value} onClick={() => update('intent', i.value)}
            className={clsx('flex-1 py-2 rounded-xl text-xs font-black transition-all',
              activeIntent === i.value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600')}>
            {i.label}
          </button>
        ))}
      </div>

      <div className="flex p-1 bg-slate-50 rounded-2xl mt-2">
        {SEGMENTS.map(s => (
          <button key={s.value} onClick={() => update('segment', s.value)}
            className={clsx('flex-1 py-2 rounded-xl text-xs font-black transition-all',
              activeSegment === s.value ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600')}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Budget */}
      <SectionTitle>Budget Range</SectionTitle>
      <div className="space-y-2">
        {BUDGETS.map(b => (
          <button key={b.label} onClick={() => { update('minPrice', b.min); update('maxPrice', b.max); }}
            className={clsx('w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all border',
              minP === b.min && maxP === b.max ? 'bg-blue-50 border-blue-100 text-blue-600 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-50')}>
            {b.label}
          </button>
        ))}
      </div>

      {/* BHK */}
      <SectionTitle>Bedrooms (BHK)</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {BHK_OPTS.map(b => (
          <button key={b} onClick={() => toggle('bhk', b)}
            className={clsx('w-10 h-10 rounded-xl text-xs font-black border transition-all',
              activeBhk.includes(b) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400')}>
            {b}
          </button>
        ))}
      </div>

      {/* Posted By */}
      <SectionTitle>Posted By</SectionTitle>
      <div className="space-y-2">
        {POSTER_TYPES.map(t => (
          <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
            <div className={clsx('w-5 h-5 rounded-md border flex items-center justify-center transition-all',
              activePosters.includes(t.value) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400')}>
              {activePosters.includes(t.value) && <span className="text-white text-[10px]">✓</span>}
            </div>
            <input type="checkbox" className="hidden" onChange={() => toggle('posterType', t.value)} />
            <span className={clsx('text-xs font-bold transition-colors', activePosters.includes(t.value) ? 'text-slate-900' : 'text-slate-500')}>{t.label}</span>
          </label>
        ))}
      </div>

      {/* Amenities */}
      <SectionTitle>Key Amenities</SectionTitle>
      <div className="space-y-2">
        {AMENITIES.map(a => (
          <label key={a} className="flex items-center gap-3 cursor-pointer group">
            <div className={clsx('w-5 h-5 rounded-md border flex items-center justify-center transition-all',
              activeAmenities.includes(a) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400')}>
              {activeAmenities.includes(a) && <span className="text-white text-[10px]">✓</span>}
            </div>
            <input type="checkbox" className="hidden" onChange={() => toggle('amenities', a)} />
            <span className={clsx('text-xs font-bold transition-colors', activeAmenities.includes(a) ? 'text-slate-900' : 'text-slate-500')}>{a}</span>
          </label>
        ))}
      </div>
    </aside>
  );
}
