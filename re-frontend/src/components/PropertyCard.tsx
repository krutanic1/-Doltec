import Link from 'next/link';
import Image from 'next/image';
import { Property, formatPrice } from '@/lib/api';

interface Props { property: Property; }

export default function PropertyCard({ property: p }: Props) {
  const img   = p.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';
  const title = p.title || 'Exclusive Property';
  const loc   = p.location?.locality || p.location?.city || 'Prime Location';
  const slug  = p.slug || p.id;

  return (
    <article className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={img} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:768px) 100vw, 33vw" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">{p.intent}</span>
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest">{p.segment}</span>
        </div>
        <div className="absolute bottom-4 left-4">
           <p className="bg-slate-900/80 backdrop-blur-md text-white text-lg font-black px-4 py-2 rounded-2xl">{formatPrice(p.pricing?.amount || 0)}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">📍 {loc}, {p.location?.city}</p>
        <h3 className="text-lg font-black text-slate-900 truncate mb-4 group-hover:text-blue-600 transition-colors tracking-tight">{title}</h3>

        {/* Facts */}
        <div className="flex items-center gap-6 border-t border-slate-100 pt-5 mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beds</span>
            <span className="text-sm font-black text-slate-700">{p.features?.bhk || '—'}</span>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area</span>
            <span className="text-sm font-black text-slate-700">{p.features?.areaSqFt || '—'} <small className="text-[8px] uppercase">sqft</small></span>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span>
            <span className="text-sm font-black text-slate-700 capitalize">{p.features?.furnishing || 'Property'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/properties/${slug}`} className="flex-grow bg-slate-50 text-slate-900 h-14 rounded-2xl flex items-center justify-center font-black text-sm hover:bg-blue-600 hover:text-white transition-all duration-300">
            View Details
          </Link>
          <button className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
             ❤️
          </button>
        </div>
      </div>
    </article>
  );
}
