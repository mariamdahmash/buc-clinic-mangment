import { Facebook } from 'lucide-react';

export default function Footer({ clinic }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          {clinic?.logo && (
            <img
              src={clinic.logo}
              alt={clinic.name}
              className="h-12 w-24 rounded bg-white object-contain"
            />
          )}
          <div>
            <p className="font-extrabold text-brand-950">{clinic?.name || 'العيادة الطبية'}</p>
            {clinic?.address && (
              <p className="mt-1 text-xs text-slate-500">{clinic.address}</p>
            )}
          </div>
        </div>

        <p className="text-xs leading-6 text-slate-500">
          هذه الصفحة التعريفية لا تمثل نظام حجز طبي مؤكد. يرجى الاتصال بالمركز لتأكيد الخدمات والمواعيد.
        </p>

        {clinic?.facebookUrl && (
          <a
            href={clinic.facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="صفحة فيسبوك"
            className="inline-flex items-center gap-2 font-bold text-brand-700 hover:text-brand-900"
          >
            <Facebook size={18} /> فيسبوك
          </a>
        )}
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {currentYear} {clinic?.name || 'جميع الحقوق محفوظة'}.
      </div>
    </footer>
  );
}