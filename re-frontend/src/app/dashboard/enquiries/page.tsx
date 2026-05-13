'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  property: {
    title: string;
    location: { city: string };
  };
}

export default function EnquiriesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - in real app use api.get('/leads')
    setTimeout(() => {
      setLeads([
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '+91 98765 43210',
          message: 'Interested in the property, please call me.',
          status: 'NEW',
          createdAt: new Date().toISOString(),
          property: { title: 'Luxury 3BHK Apartment', location: { city: 'Bengaluru' } }
        },
        {
          id: '2',
          name: 'Priya Singh',
          email: 'priya@example.com',
          phone: '+91 91234 56789',
          message: 'Is the price negotiable?',
          status: 'CONTACTED',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          property: { title: 'Modern Studio Flat', location: { city: 'Mumbai' } }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Lead Management</p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recent Enquiries</h1>
        </div>
        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
          Export Leads (CSV)
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
           {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white border border-slate-200 rounded-[32px] animate-pulse" />)}
        </div>
      ) : leads.length > 0 ? (
        <div className="grid gap-4">
          {leads.map(lead => (
            <div key={lead.id} className="bg-white border border-slate-200 rounded-[32px] p-8 flex items-center justify-between hover:shadow-xl hover:shadow-slate-100 transition-all group">
              <div className="flex items-center gap-8">
                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                       <p className="font-black text-slate-900 text-lg tracking-tight">{lead.name}</p>
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                         lead.status === 'NEW' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                       }`}>{lead.status}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500">{lead.email} · {lead.phone}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Interested in: <span className="text-slate-600 font-bold">{lead.property.title}</span></p>
                 </div>
              </div>
              
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                   {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                 </p>
                 <div className="flex gap-2">
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all">View Message</button>
                    <button className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-xs font-black hover:bg-red-50 hover:text-red-500 transition-all">Archive</button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[40px] p-20 text-center">
           <p className="text-4xl mb-4">📨</p>
           <h3 className="text-xl font-black text-slate-900">No enquiries yet</h3>
           <p className="text-slate-500 font-medium">When users enquire about your listings, they will appear here.</p>
        </div>
      )}
    </div>
  );
}
