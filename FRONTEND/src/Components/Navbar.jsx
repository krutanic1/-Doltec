import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/real-estate/login';
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/real-estate" className="text-2xl font-black text-slate-900 tracking-tighter">
            DOLTEC<span className="text-blue-600">.</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link to="/real-estate/properties?intent=BUY" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Buy</Link>
            <Link to="/real-estate/properties?intent=RENT" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Rent</Link>
            <Link to="/real-estate/properties?segment=COMMERCIAL" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Commercial</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <Link to="/real-estate/dashboard" className="text-sm font-bold text-slate-900 hover:text-blue-600">Dashboard</Link>
               <button onClick={handleLogout} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-red-50 hover:text-red-600 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex gap-3">
               <Link to="/real-estate/login" className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-colors">Log In</Link>
               <Link to="/real-estate/register" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
