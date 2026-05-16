import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/real-estate/login';
          return;
        }
        const res = await axios.get('http://localhost:5000/api/v1/properties/my-properties', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(res.data);
      } catch (err) {
        console.error('Failed to fetch my properties', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/real-estate/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, []);

  if (loading) return <div className="p-20 text-center font-black text-slate-400">Loading your listings...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage My Properties</h1>
        <Link to="/real-estate/create-property" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">+ Post New Property</Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center p-20 bg-white rounded-[40px] shadow-sm border border-slate-200">
          <p className="text-2xl font-black text-slate-400 mb-4">You haven't posted any properties yet.</p>
          <Link to="/real-estate/create-property" className="text-blue-600 font-black hover:underline">Start listing now →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(p => (
            <div key={p._id} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="aspect-video bg-slate-100 relative">
                {p.media && p.media.length > 0 ? (
                  <img src={p.media[0].url} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Photos</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
                    p.status === 'APPROVED' ? 'bg-green-500 text-white' : 
                    p.status === 'REJECTED' ? 'bg-red-500 text-white' : 
                    'bg-amber-500 text-white'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-black text-slate-900 mb-1 truncate">{p.title}</h3>
                <p className="text-xs font-bold text-slate-500 mb-4">{p.location?.city}, {p.location?.locality}</p>
                <div className="flex justify-between items-center text-sm font-black border-t border-slate-100 pt-4">
                   <p className="text-blue-600 font-black">₹{p.pricing?.amount}</p>
                   <p className="text-slate-400 uppercase">{p.features?.bhk} BHK</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                 <Link to={`/real-estate/properties/${p.slug}`} className="flex-1 text-center py-2 text-xs font-black bg-white border border-slate-200 rounded-xl hover:bg-slate-50">View Page</Link>
                 <Link to={`/real-estate/edit-property/${p.slug}`} className="flex-1 text-center py-2 text-xs font-black bg-white border border-slate-200 rounded-xl hover:bg-slate-50">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
