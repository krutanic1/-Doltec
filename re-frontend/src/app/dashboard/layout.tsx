'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const MENU = [
  { label: 'My Listings', icon: '🏠', href: '/dashboard' },
  { label: 'Enquiries',   icon: '📨', href: '/dashboard/enquiries' },
  { label: 'Saved',       icon: '🔖', href: '/dashboard/saved' },
  { label: 'Profile',     icon: '👤', href: '/dashboard/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-10">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-4 mb-8 p-2">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-600 text-lg">J</div>
            <div>
              <p className="font-black text-slate-900 leading-none mb-1">John Doe</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Property Poster</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {MENU.map(m => (
              <Link key={m.label} href={m.href}
                className={clsx('flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all',
                  path === m.href ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')}>
                <span className="text-lg">{m.icon}</span>
                {m.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-100">
             <Link href="/post" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center hover:bg-blue-600 transition-all">
               + Post Property
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}
