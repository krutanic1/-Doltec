'use client';
import { useEffect, useState } from 'react';

export default function ModerationPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setListings([
        {
          id: '1',
          title: 'Prestige Lakeside Villa',
          location: 'Whitefield, Bengaluru',
          price: '₹4.5 Cr',
          poster: 'PropSolutions Realty (Agent)',
          status: 'PENDING',
          createdAt: '2 hours ago'
        },
        {
          id: '2',
          title: 'Cozy 2BHK Near Metro',
          location: 'Indiranagar, Bengaluru',
          price: '₹1.2 Cr',
          poster: 'Suresh Raina (Owner)',
          status: 'PENDING',
          createdAt: '5 hours ago'
        },
        {
          id: '3',
          title: 'Commercial Office Space',
          location: 'Outer Ring Road, Bengaluru',
          price: '₹85,000 /mo',
          poster: 'DLF Builders (Builder)',
          status: 'PENDING',
          createdAt: '1 day ago'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Moderation Queue</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Property Approvals</h1>
        </div>
        <div className="flex gap-3">
          <input type="text" placeholder="Search by ID or Title..." className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-bold text-slate-600 outline-none focus:border-blue-600 transition-all w-64" />
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all">Bulk Approve</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
           <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Details</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Poster</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan={4} className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Scanning Queue...</td>
                </tr>
              ) : listings.map(l => (
                <tr key={l.id} className="hover:bg-slate-50/50 transition-colors group">
                   <td className="px-10 py-8">
                      <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{l.title}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">{l.location} · {l.createdAt}</p>
                   </td>
                   <td className="px-10 py-8">
                      <p className="font-black text-slate-700 text-sm">{l.poster}</p>
                      <button className="text-[10px] font-black text-blue-600 uppercase hover:underline mt-1">Verify Poster</button>
                   </td>
                   <td className="px-10 py-8">
                      <p className="font-black text-slate-900 text-lg">{l.price}</p>
                   </td>
                   <td className="px-10 py-8">
                      <div className="flex gap-2">
                         <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">Approve</button>
                         <button className="px-5 py-2.5 bg-white border border-slate-200 text-red-500 rounded-xl text-xs font-black hover:bg-red-50 hover:border-red-100 transition-all">Reject</button>
                         <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all">👁️</button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
