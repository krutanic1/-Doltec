import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchModule from '@/components/SearchModule';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/lib/api';

export default async function Home() {
  const { data: featured } = await fetchProperties({ limit: 6 });

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4]" alt="Luxury Home" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl px-6 text-center">
          <p className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">Find your sanctuary</p>
          {/* <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.9] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Real Estate <br/>Redefined.
          </h1> */}
          
          <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
             <SearchModule />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Residential Buy', icon: '🏠', color: 'bg-blue-50', text: 'text-blue-600', href: '/properties?intent=BUY&segment=RESIDENTIAL' },
            { label: 'Commercial Buy', icon: '🏢', color: 'bg-indigo-50', text: 'text-indigo-600', href: '/properties?intent=BUY&segment=COMMERCIAL' },
            { label: 'Residential Rent', icon: '🔑', color: 'bg-emerald-50', text: 'text-emerald-600', href: '/properties?intent=RENT&segment=RESIDENTIAL' },
            { label: 'Commercial Rent', icon: '🏭', color: 'bg-amber-50', text: 'text-amber-600', href: '/properties?intent=RENT&segment=COMMERCIAL' },
          ].map(link => (
            <a key={link.label} href={link.href} className="group p-8 rounded-[40px] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 text-center">
               <div className={`w-16 h-16 ${link.color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform`}>{link.icon}</div>
               <p className="font-black text-slate-900 tracking-tight">{link.label}</p>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Explore →</p>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Handpicked for you</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Featured Collections</h2>
            </div>
            <a href="/properties" className="font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2">
              View all listings <span className="text-xl">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featured?.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-32 bg-white">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Trending Localities</h2>
            <p className="text-slate-500 text-lg font-medium mb-12">Explore the most sought-after neighborhoods in Bengaluru.</p>
            <div className="flex flex-wrap justify-center gap-3">
               {['Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City', 'HSR Layout', 'JP Nagar', 'Hebbal'].map(loc => (
                 <a key={loc} href={`/properties?locality=${loc}`} className="px-8 py-3 rounded-2xl border border-slate-100 font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                   {loc}
                 </a>
               ))}
            </div>
         </div>
      </section>
    </main>
  );
}
