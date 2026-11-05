import { Stethoscope } from 'lucide-react';

export default function DoctorsSection({ doctors }) {
  if (!doctors || doctors.length === 0) return null;

  return (
    <section id="doctors" className="scroll-mt-24 py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-extrabold text-brand-600">الفريق الطبي</span>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-950 sm:text-4xl">أطباء العيادة</h2>
          <p className="mt-4 leading-8 text-slate-600">نخبة من الأطباء المتخصصين في خدمتك.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => (
            <article key={doc._id} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition hover:shadow-md">
              <img
                src={doc.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
                alt={doc.name}
                className="h-48 w-full rounded-2xl object-cover mb-4"
              />
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">
                {doc.specialtyId?.name || 'تخصص عام'}
              </span>
              <h3 className="mt-3 text-xl font-extrabold text-brand-950">{doc.name}</h3>
              <p className="text-sm font-semibold text-brand-700">{doc.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">{doc.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}