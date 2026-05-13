'use client';
import Link from 'next/link';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200 flex">
        {/* Visual Side */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter">DOLTEC<span className="text-blue-500">.</span></Link>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">Elevate Your Living Experience.</h1>
            <p className="text-slate-400 font-medium text-lg">Join thousands of people finding their dream homes and premium commercial spaces on Doltec.</p>
          </div>

          {/* Abstract decoration */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600 rounded-full blur-[120px] opacity-40" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-indigo-600 rounded-full blur-[100px] opacity-30" />
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-1/2 p-12 md:p-20">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{title}</h2>
            <p className="text-slate-500 font-medium mb-10">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
