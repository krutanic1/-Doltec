import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'USER' });
  const [error, setError] = useState('');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/real-estate/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="bg-white p-10 rounded-[40px] shadow-sm max-w-md w-full border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight text-center">Create Account</h1>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">I am a</label>
            <select name="role" value={formData.role} onChange={onChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none focus:border-blue-600 border border-transparent transition-colors">
              <option value="USER">Buyer / Tenant</option>
              <option value="OWNER">Property Owner</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none focus:border-blue-600 border border-transparent transition-colors" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none focus:border-blue-600 border border-transparent transition-colors" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none focus:border-blue-600 border border-transparent transition-colors" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold outline-none focus:border-blue-600 border border-transparent transition-colors" required />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
