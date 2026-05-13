'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - in real app use api.get('/admin/stats')
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalProperties: 342,
        pendingApprovals: 18,
        reportedListings: 4,
        recentLeads: 85
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <div className="p-10 animate-pulse text-slate-400 font-black">Loading metrics...</div>;

  return (
    <div className="space-y-12">
      <div>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Platform Overview</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Users', val: stats.totalUsers, icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Live Listings', val: stats.totalProperties, icon: '🏠', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Approvals', val: stats.pendingApprovals, icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Abuse Reports', val: stats.reportedListings, icon: '🚩', color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
             <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>{s.icon}</div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
             <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[48px] p-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Listings</h3>
               <a href="/admin/moderation" className="text-xs font-bold text-blue-600 hover:underline">View all moderation queue →</a>
            </div>
            
            <div className="space-y-4">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-12 bg-slate-200 rounded-xl overflow-hidden">
                          <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200&auto=format&fit=crop`} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black text-slate-900 leading-tight">Modern 3BHK Apartment</p>
                          <p className="text-xs font-bold text-slate-400 mt-1">By Amit Kumar · Whitefield, BLR</p>
                       </div>
                    </div>
                    <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Pending</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden">
            <h3 className="text-xl font-black mb-8 relative z-10 tracking-tight">Marketplace Insights</h3>
            <div className="space-y-8 relative z-10">
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Today's Leads</p>
                  <p className="text-5xl font-black text-blue-400">85</p>
               </div>
               <div className="pt-8 border-t border-white/10">
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">System performance is optimal. Database latency is within 50ms. All services are healthy.</p>
               </div>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-40" />
         </div>
      </div>
    </div>
  );
}
