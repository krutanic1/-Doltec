import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const query = searchParams.toString();
        const res = await axios.get(`http://localhost:5000/api/v1/properties?${query}`);
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [searchParams]);

  if (loading) return <div className="p-20 text-center font-black text-slate-400">Loading Properties...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Properties for You</h1>
      {properties.length === 0 ? (
        <div className="text-center p-20 bg-white rounded-[40px] shadow-sm">
          <p className="text-2xl font-black text-slate-400">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(p => (
            <Link key={p._id} to={`/real-estate/properties/${p.slug}`} className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all">
               <div className="aspect-[4/3] bg-slate-200 relative">
                  {p.media && p.media.length > 0 ? (
                     <img src={p.media[0].url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase">{p.intent}</span>
                  </div>
               </div>
               <div className="p-6">
                  <p className="text-xl font-black text-slate-900 mb-2 truncate">{p.title}</p>
                  <p className="text-sm font-bold text-slate-500 mb-4">{p.location?.locality}, {p.location?.city}</p>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                     <p className="text-xl font-black text-blue-600">₹{p.pricing?.amount}</p>
                     <p className="text-xs font-black text-slate-400 uppercase">{p.features?.bhk} BHK</p>
                  </div>
               </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
