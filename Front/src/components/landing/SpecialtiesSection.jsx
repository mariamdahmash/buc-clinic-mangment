import { Stethoscope } from 'lucide-react';

export default function SpecialtiesSection({ specialties }) {
  if (!specialties || specialties.length === 0) return null;

  return (
    <section id="specialties" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-extrabold text-brand-600">الأقسام الطبية</span>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-950 sm:text-4xl">التخصصات المتاحة بالمركز</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((spec) => (
            <div key={spec._id} className="rounded-3xl border border-slate-100 bg-brand-50/40 p-6 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <Stethoscope size={28} />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-brand-950">{spec.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{spec.description || 'فحوصات واستشارات متخصصة.'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}