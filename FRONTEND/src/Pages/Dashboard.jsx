import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) navigate('/real-estate/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-10">
      <div className="bg-slate-900 text-white p-12 rounded-[48px] mb-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">Welcome, {user.name}</h1>
          <p className="text-slate-400 font-medium">Manage your properties, leads, and profile from your dashboard.</p>
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🏠</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">My Properties</h3>
          <p className="text-slate-500 mb-6">View and edit your live listings.</p>
          <Link to="/real-estate/manage" className="text-sm font-black text-blue-600 hover:underline">Manage Properties →</Link>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">📝</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Post New Property</h3>
          <p className="text-slate-500 mb-6">Add a new listing to the marketplace.</p>
          <Link to="/real-estate/create-property" className="text-sm font-black text-blue-600 hover:underline">Create Listing →</Link>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">📨</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">My Enquiries</h3>
          <p className="text-slate-500 mb-6">Check messages from interested buyers.</p>
          <Link to="/real-estate/leads" className="text-sm font-black text-blue-600 hover:underline">View Leads →</Link>
        </div>
      </div>
    </div>
  );
}
