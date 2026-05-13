'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { fetchProperty, Property, formatPrice } from '@/lib/api';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [p, setP] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty(slug as string).then(res => {
      setP(res);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse">
       <div className="h-[500px] bg-slate-200 rounded-[40px] mb-10" />
       <div className="h-10 bg-slate-200 rounded-xl w-1/3 mb-4" />
       <div className="h-6 bg-slate-200 rounded-xl w-1/4" />
    </div>
  );

  if (!p) return <div className="p-20 text-center font-black">Property not found</div>;

  const heroImage = p.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Gallery */}
      <div className="max-w-[1440px] mx-auto px-6 pt-10">
        <div className="relative h-[600px] rounded-[48px] overflow-hidden group">
          <Image src={heroImage} alt={p.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
            <div>
               <div className="flex gap-3 mb-6">
                 <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest">{p.intent}</span>
                 <span className="bg-blue-600/80 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest">{p.segment}</span>
               </div>
               <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-4">{p.title}</h1>
               <p className="text-xl text-white/80 font-medium tracking-tight">📍 {p.location.locality}, {p.location.city}, {p.location.state}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white">
               <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Asking Price</p>
               <p className="text-4xl font-black">{formatPrice(p.pricing.amount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-[1440px] mx-auto px-6 mt-16 flex flex-col lg:flex-row gap-16">
        <div className="flex-grow space-y-16">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-8 bg-slate-50 p-10 rounded-[40px]">
            {[
              { label: 'BHK', val: p.features.bhk || '—', icon: '🛏️' },
              { label: 'Area', val: `${p.features.areaSqFt} sqft`, icon: '📐' },
              { label: 'Status', val: p.features.furnishing || 'Semi-Furnished', icon: '🏠' },
              { label: 'Floor', val: '5th of 12', icon: '🏢' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{s.label}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-lg font-black text-slate-900">{s.val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">About this property</h2>
            <p className="text-slate-500 leading-relaxed text-lg font-medium whitespace-pre-wrap">
              {p.description || "Experience luxury living at its finest in this stunning property. Featuring modern design, high-quality finishes, and breathtaking views, this home offers everything you need for a comfortable and stylish lifestyle. Perfect for families or professionals seeking a premium space."}
            </p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Features & Amenities</h2>
            <div className="grid grid-cols-3 gap-4">
              {p.amenities?.map(a => (
                <div key={a} className="flex items-center gap-4 p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">✨</div>
                  <span className="text-sm font-bold text-slate-700">{a}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Form */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="bg-slate-900 text-white p-10 rounded-[48px] sticky top-24 shadow-2xl shadow-slate-200">
             <h3 className="text-2xl font-black mb-2 tracking-tight">Enquire Now</h3>
             <p className="text-slate-400 text-sm mb-8 font-medium">Interested in this property? Get in touch with the poster directly.</p>
             
             <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors font-bold text-sm" />
                <input type="email" placeholder="Your Email" className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors font-bold text-sm" />
                <input type="tel" placeholder="Phone Number" className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors font-bold text-sm" />
                <textarea placeholder="I'm interested in this property..." rows={4} className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors font-bold text-sm resize-none" />
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 mt-4 active:scale-95">
                  Send Message
                </button>
             </form>

             <div className="mt-10 pt-10 border-t border-white/10">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl">👤</div>
                   <div>
                      <p className="font-black text-lg leading-tight">{p.poster?.name || 'Authorized Seller'}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{p.poster?.posterType || 'Agent'}</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
