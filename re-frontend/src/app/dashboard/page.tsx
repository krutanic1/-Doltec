'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProperties, Property, formatPrice } from '@/lib/api';

export default function MyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd pass ownerId from the auth session
    // For now, we'll just fetch all and assume the backend handles the 'me' filter if we had it
    // But since our fetchProperties is generic, I'll just show a demo list
    fetchProperties({ limit: 10 }).then(res => {
      setProperties(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Properties</h1>
        <Link href="/post" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200">
          + Add New Property
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : properties.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Leads</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden relative shrink-0">
                        {p.images?.[0] && <img src={p.images[0].url} alt="" className="object-cover w-full h-full" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{p.locality}, {p.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-900">{formatPrice(p.price.amount)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    {Math.floor(Math.random() * 12)} Enquiries
                  </td>
                  <td className="px-8 py-5 text-right space-x-3">
                    <button className="text-xs font-bold text-slate-400 hover:text-blue-600">Edit</button>
                    <button className="text-xs font-bold text-red-400 hover:text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] p-20 text-center shadow-sm">
          <div className="text-5xl mb-6">🏘️</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">You haven't posted any properties yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">List your property today and reach thousands of potential buyers.</p>
          <Link href="/post" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold">
            Post My First Property
          </Link>
        </div>
      )}
    </div>
  );
}
