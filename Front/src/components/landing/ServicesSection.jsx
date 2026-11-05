import { Activity, Syringe, Microscope, ArrowLeft } from 'lucide-react';

export default function ServicesSection({ services }) {
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-24 bg-slate-50/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-extrabold text-brand-600">الخدمات الطبية</span>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-950 sm:text-4xl">خدمات ورعاية متكاملة</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Activity size={24} />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-brand-950">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
              {service.price > 0 && (
                <p className="mt-4 text-sm font-extrabold text-brand-700">السعر: {service.price} ج.م</p>
              )}
              <a href="#contact" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-700">
                استفسر عن الخدمة <ArrowLeft size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}