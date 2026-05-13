// src/components/Footer.tsx
import Link from 'next/link';
import { CITIES } from '@/lib/api';

const LINKS = {
  Platform: ['Buy', 'Rent', 'New Launch', 'Commercial', 'Post Property'],
  Company:  ['About Doltec', 'Help Center', 'Privacy Policy', 'Terms of Use'],
};

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-slate-400 py-16 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-black text-white">Doltec</span>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ESTATES</span>
            </div>
            <p className="text-sm leading-relaxed max-w-[220px]">
              India's trusted property marketplace. Verified listings, direct owner connect, zero hassle.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-5">{title}</p>
              {links.map(l => <p key={l} className="text-sm mb-3 hover:text-white cursor-pointer transition-colors">{l}</p>)}
            </div>
          ))}

          {/* Cities */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest mb-5">Cities</p>
            {CITIES.map(c => (
              <Link key={c.value} href={`/properties?city=${c.value}`}
                className="block text-sm mb-3 hover:text-white transition-colors">{c.label}</Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-xs text-center text-slate-600">
          © {new Date().getFullYear()} Doltec Estates. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
