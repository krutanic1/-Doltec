import React from 'react';
import { motion } from 'framer-motion';

export default function InsightsSidebar({ city = 'Bengaluru' }) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 sticky top-56 h-[calc(100vh-240px)] overflow-y-auto no-scrollbar pb-10">
      {/* Locality Insight */}
      <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          Locality Snapshot
        </h4>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg. Price</span>
            <span className="text-base font-black text-slate-900">₹9,450/sqft</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Price Trend</span>
            <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg flex items-center gap-1 border border-green-100">
              +4.2% ↑
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Demand</span>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">HIGH</span>
          </div>
        </div>
        <button className="w-full mt-8 py-3.5 rounded-2xl border-2 border-blue-600 text-blue-600 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-50">
          Trends Report
        </button>
      </section>

      {/* Home Loan CTA */}
      <section className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="mb-6">
            <span className="bg-blue-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">Partner Offer</span>
          </div>
          <h4 className="text-xl font-black leading-tight mb-3">Get Home Loan at 8.4%*</h4>
          <p className="text-xs text-slate-400 mb-8 leading-relaxed font-bold">Check your eligibility across 20+ banks instantly with our expert advisor.</p>
          <button className="w-full py-4 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95">
            Check Eligibility
          </button>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/30 transition-colors"></div>
      </section>

      {/* Advisor CTA */}
      <section className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100">
        <h4 className="text-lg font-black mb-2">Expert Consultation</h4>
        <p className="text-xs text-blue-100 mb-8 font-bold leading-relaxed">Talk to our property advisors for curated matches and site visits.</p>
        <div className="flex -space-x-2 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className="w-10 h-10 rounded-2xl border-2 border-blue-600 bg-blue-400 overflow-hidden shadow-lg">
              <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Advisor" className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-2xl border-2 border-blue-600 bg-white flex items-center justify-center text-[10px] font-black text-blue-600 shadow-lg">+12</div>
        </div>
        <button className="w-full py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
          Call Advisor
        </button>
      </section>

      {/* Guides */}
      <div className="px-4">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6">Resources</h5>
        <ul className="space-y-4">
          {['Property Buying Guide', 'Home Loan Process', 'Legal Checklists'].map(guide => (
            <li key={guide}>
              <a href="#" className="flex items-center gap-4 group text-sm font-black text-slate-600 hover:text-blue-600 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                {guide}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
