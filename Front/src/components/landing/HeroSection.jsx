import { ArrowLeft, CheckCircle2, HeartPulse, Phone } from 'lucide-react';

export default function HeroSection({ clinic }) {
  const primaryPhone = clinic?.phoneNumbers?.[0] || '';

  return (
    <section className="relative isolate">
      <div className="absolute inset-0 -z-20 bg-gradient-to-l from-brand-50 via-white to-white" />
      <div className="absolute -left-24 top-12 -z-10 h-72 w-72 rounded-full bg-brand-100/70 blur-3xl" />
      
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[1.03fr_.97fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-xs font-extrabold text-brand-800 shadow-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {clinic?.name || 'مرحباً بك في عيادتنا'}
          </div>
          
          <h1 className="text-4xl font-extrabold leading-[1.45] tracking-tight text-brand-950 sm:text-5xl lg:text-[3.6rem]">
            رعاية أقرب لك،
            <span className="block text-brand-600">واطمئنان يبدأ من هنا</span>
          </h1>
          
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            نهتم بتسهيل وصولك إلى الخدمات الصحية. تعرّف على الخدمات المتاحة وتواصل مع المركز للاستفسار عن المواعيد والتفاصيل.
          </p>
          
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-extrabold text-white shadow-xl shadow-brand-700/20 transition hover:-translate-y-0.5 hover:bg-brand-800">
              احجز موعدك <ArrowLeft size={18} />
            </a>
            {primaryPhone && (
              <a href={`tel:${primaryPhone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-7 py-4 font-extrabold text-brand-800 transition hover:bg-brand-50">
                <Phone size={18} /> اتصل بنا الآن
              </a>
            )}
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-brand-600" /> معلومات واضحة عن الخدمات</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-brand-600" /> تواصل مباشر مع المركز</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-white bg-brand-100 shadow-soft">
            <img
              src={clinic?.coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=85'}
              alt={clinic?.name}
              className="h-[330px] w-full object-cover sm:h-[430px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/65 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 left-0 p-6 text-white sm:p-8">
              <p className="text-sm font-bold text-brand-100">{clinic?.name}</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">صحتك تستحق الاهتمام</h2>
            </div>
          </div>
          <div className="absolute -right-2 top-8 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
            <span className="rounded-xl bg-brand-50 p-3 text-brand-700"><HeartPulse size={23} /></span>
            <span><b className="block text-sm text-slate-800">اهتمام بصحتك</b><small className="mt-1 block text-slate-500">من أول استفسار</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}