// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const NAV_LINKS = [
  { label: 'Buy',        href: '/properties?type=buy'         },
  { label: 'Rent',       href: '/properties?type=rent'        },
  { label: 'New Launch', href: '/properties?type=new-launch'  },
  { label: 'Commercial', href: '/properties?type=commercial'  },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-[#1e1e2e] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-black text-white tracking-tight">Doltec</span>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ESTATES</span>
        </Link>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href}
              className={clsx('text-sm font-semibold transition-colors',
                path?.startsWith(href.split('?')[0])
                  ? 'text-white' : 'text-white/60 hover:text-white')}>
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/auth" className="hidden sm:block text-sm font-semibold text-white/70 hover:text-white transition-colors">Login</Link>
          <Link href="/post"
            className="bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Post <span className="text-green-600">FREE</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
