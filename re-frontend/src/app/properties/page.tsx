'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProperties, Property, ListResponse } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FilterSidebar from '@/components/FilterSidebar';
import PropertyCard from '@/components/PropertyCard';
import CardSkeleton from '@/components/CardSkeleton';

function ListingsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<ListResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setLoading(true);
    fetchProperties({ ...params, limit: 12 }).then(res => {
      setData(res);
      setLoading(false);
    });
  }, [searchParams]);

  return (
    <div className="flex-grow">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Search Results</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {loading ? 'Finding properties...' : `${data?.meta.total || 0} Properties Found`}
          </h1>
        </div>
        <div className="flex gap-4">
           {/* Sorting placeholder */}
           <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 outline-none">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {data.data.map(p => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[40px] p-20 text-center shadow-sm">
          <div className="text-6xl mb-6">🏜️</div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No matching properties</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your filters or search for a different location to find what you're looking for.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && data && data.meta.lastPage > 1 && (
        <div className="mt-12 flex justify-center gap-2">
           {Array.from({ length: data.meta.lastPage }).map((_, i) => (
             <button key={i} className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${
               (Number(searchParams.get('page')) || 1) === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'
             }`}>
               {i + 1}
             </button>
           ))}
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-10 flex gap-10">
        <Suspense fallback={<div className="w-72 bg-white rounded-[32px] animate-pulse h-[600px]" />}>
          <FilterSidebar />
        </Suspense>
        
        <Suspense fallback={<div className="flex-grow grid grid-cols-3 gap-8"><CardSkeleton /> <CardSkeleton /> <CardSkeleton /></div>}>
          <ListingsContent />
        </Suspense>
      </div>
    </div>
  );
}
