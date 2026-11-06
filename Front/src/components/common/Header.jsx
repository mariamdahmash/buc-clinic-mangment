import { useState } from 'react';
import { Menu, X, ArrowLeft, ShieldCheck, Phone } from 'lucide-react';

export default function Header({ clinic }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const quickLinks = [
    { label: 'التخصصات', href: '#specialties' },
    { label: 'الأطباء', href: '#doctors' },
    { label: 'الخدمات', href: '#services' },
    { label: 'حجز موعد', href: '#booking' },
    { label: 'تواصل معنا', href: '#contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p className="flex items-center gap-2">
            <ShieldCheck size={15} /> رعايتك الصحية تبدأ من خطوة مطمئنة
          </p>
          {clinic?.phoneNumbers && clinic.phoneNumbers.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              {clinic.phoneNumbers.map((phone, idx) => (
                <a key={idx} className="inline-flex items-center gap-1.5 hover:text-brand-200" href={`tel:${phone}`}>
                  <Phone size={13} /> {phone}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo & Dynamic Clinic Name */}
          <a href="#home" className="flex items-center gap-3">
            {clinic?.logo && (
              <img src={clinic.logo} alt={clinic.name} className="h-[50px] w-[100px] rounded-lg object-contain bg-white" />
            )}
            <span className="border-r border-slate-200 pr-3">
              <span className="block text-sm font-extrabold text-brand-900">{clinic?.name || 'عياداتنا'}</span>
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-bold text-slate-600 transition hover:text-brand-700">
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#booking" className="hidden items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-brand-800 lg:inline-flex">
            احجز موعدك <ArrowLeft size={16} />
          </a>

          <button
            type="button"
            aria-label="القائمة" aria-expanded={menuOpen}
            className="rounded-xl border border-slate-200 p-2 text-brand-900 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 font-bold text-slate-700 hover:bg-brand-50">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}