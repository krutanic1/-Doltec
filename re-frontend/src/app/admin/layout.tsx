'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const MENU = [
  { label: 'Overview', icon: '📊', href: '/admin' },
  { label: 'Listings', icon: '🏠', href: '/admin/listings' },
  { label: 'Users',    icon: '👤', href: '/admin/users' },
  { label: 'Leads',    icon: '📨', href: '/admin/leads' },
  { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tight">Doltec</span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          {MENU.map(m => (
            <Link key={m.label} href={m.href}
              className={clsx('flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all',
                path === m.href ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
           <button className="w-full bg-red-600/10 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
             🚪 Logout
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-grow flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <h2 className="font-black text-slate-900 tracking-tight">
            Admin Management Console
          </h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xs">A</div>
             <span className="text-sm font-bold text-slate-700">Administrator</span>
          </div>
        </header>

        <main className="p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
