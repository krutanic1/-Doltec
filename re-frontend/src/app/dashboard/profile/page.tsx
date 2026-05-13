'use client';
import { useState } from 'react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Account Settings</p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                 <input type="text" defaultValue="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                 <input type="email" defaultValue="john@example.com" disabled className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-sm text-slate-400 cursor-not-allowed" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
                 <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">RERA ID (Optional)</label>
                 <input type="text" placeholder="e.g. PRM/KA/RERA/1234/567/PR/190102" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-600 transition-colors font-bold text-sm" />
               </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100">
               <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">
                 Save Changes
               </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 mb-8">Security</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                   <div>
                      <p className="font-black text-slate-900">Change Password</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">Update your account password regularly for security.</p>
                   </div>
                   <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-xs font-black text-slate-900 hover:bg-white/50 transition-all">Update</button>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
           <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <h4 className="text-xl font-black mb-2 relative z-10">Premium Plan</h4>
              <p className="text-blue-100 text-sm font-medium mb-8 relative z-10">Unlock higher visibility and unlimited listing management.</p>
              <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm relative z-10 hover:bg-blue-50 transition-all">Upgrade Now</button>
              
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
           </div>

           <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-6">👤</div>
              <h4 className="font-black text-slate-900">Profile Picture</h4>
              <p className="text-xs font-medium text-slate-400 mt-1 mb-6">Upload a professional photo to build trust.</p>
              <button className="text-sm font-black text-blue-600 hover:underline">Upload Image</button>
           </div>
        </div>
      </div>
    </div>
  );
}
