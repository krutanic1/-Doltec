import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/v1/leads', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeads(res.data.data);
      } catch (err) {
        console.error('Failed to fetch leads', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-slate-400">Loading Enquiries...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">Property Enquiries</h1>
           <p className="text-slate-500 font-bold mt-1">Track and manage interest in your listings</p>
        </div>
        <div className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center gap-3">
           <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
           {leads.length} Total Leads
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white p-24 rounded-[48px] border border-slate-100 text-center shadow-sm">
           <div className="text-7xl mb-8">🏜️</div>
           <h2 className="text-3xl font-black text-slate-900 mb-3">No enquiries yet</h2>
           <p className="text-slate-500 font-medium max-w-sm mx-auto">When potential buyers or renters contact you, their details will appear here instantly.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {leads.map(lead => (
            <div key={lead._id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
               <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="flex-1 w-full">
                     <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${lead.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}>
                           {lead.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                           {new Date(lead.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                     
                     <h3 className="text-2xl font-black text-slate-900 mb-1">{lead.name}</h3>
                     <p className="text-slate-500 font-bold text-sm mb-6 flex items-center gap-2">
                        <span className="text-blue-600">🏠</span> Interested in: {lead.propertyId?.title || 'Unknown Property'}
                     </p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Phone Number</p>
                           <p className="text-slate-900 font-black">{lead.phone}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Email Address</p>
                           <p className="text-slate-900 font-black truncate">{lead.email}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="w-full lg:w-80 h-full flex flex-col">
                     <div className="bg-slate-900 text-white p-6 rounded-[32px] flex-1 mb-4 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 text-white/5 text-6xl font-black">💬</div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Enquiry Message</p>
                        <p className="text-slate-100 font-medium text-sm leading-relaxed italic">
                           "{lead.message || 'The user didn\'t leave a specific message, they are just interested in viewing.'}"
                        </p>
                     </div>
                     
                     <div className="flex gap-3">
                        <a href={`tel:${lead.phone}`} className="flex-1 bg-blue-600 text-white h-14 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-xl">📞</a>
                        <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 bg-green-500 text-white h-14 rounded-2xl flex items-center justify-center hover:bg-green-600 transition-all shadow-lg shadow-green-100 text-xl font-bold">
                           <span className="text-2xl">💬</span>
                        </a>
                        <a href={`mailto:${lead.email}`} className="flex-1 bg-slate-100 text-slate-900 h-14 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all text-xl">✉️</a>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


