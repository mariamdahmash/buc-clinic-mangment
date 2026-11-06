import { useState } from 'react';
import { Phone, MapPin, Facebook, ArrowUpLeft, ArrowLeft, ChevronDown } from 'lucide-react';

export default function ContactForm({ clinic, specialties }) {
  const [form, setForm] = useState({ name: '', phone: '', service: 'استفسار عام' });
  const [notice, setNotice] = useState('');

  const submitForm = (event) => {
    event.preventDefault();
    let clinicPhoneNumber = clinic?.phoneNumbers?.[0]?.replace(/[^0-9]/g, '') || '';
    if (!clinicPhoneNumber) { setNotice('لا يوجد رقم واتساب متاح لهذه العيادة.'); return; }
    if (clinicPhoneNumber.startsWith('01') && clinicPhoneNumber.length === 11) clinicPhoneNumber = '2' + clinicPhoneNumber;
    const message = `مرحبًا، أريد الاستفسار عن خدمات ${clinic?.name || 'العيادة'}.%0Aالاسم: ${encodeURIComponent(form.name)}%0Aرقم التواصل: ${encodeURIComponent(form.phone)}%0Aنوع الاستفسار: ${encodeURIComponent(form.service)}`;
    
    window.open(`https://wa.me/${clinicPhoneNumber}/?text=${message}`, '_blank', 'noopener,noreferrer');
    setNotice('تم تجهيز رسالة الاستفسار. أرسلها من واتساب بعد مراجعتها.');
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
        <div>
          <span className="text-sm font-extrabold text-brand-600">تواصل معنا</span>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-950 sm:text-4xl">خلّي استفسارك أول خطوة</h2>
          <p className="mt-4 leading-8 text-slate-600">يمكنك الاتصال مباشرة أو تجهيز رسالة استفسار عبر واتساب.</p>
          
          <div className="mt-8 space-y-5">
            {clinic?.phoneNumbers?.map((phone, idx) => (
              <a key={idx} href={`tel:${phone}`} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/50">
                <span className="rounded-xl bg-brand-50 p-3 text-brand-700"><Phone size={22} /></span>
                <span>
                  <small className="block text-slate-500">رقم التواصل {idx + 1}</small>
                  <b dir="ltr" className="mt-1 block text-lg text-brand-950">{phone}</b>
                </span>
              </a>
            ))}

            {clinic?.address && (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                <span className="rounded-xl bg-brand-50 p-3 text-brand-700"><MapPin size={22} /></span>
                <span>
                  <small className="block text-slate-500">العنوان</small>
                  <b className="mt-1 block text-brand-950">{clinic.address}</b>
                </span>
              </div>
            )}

            {clinic?.facebookUrl && (
              <a href={clinic.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-extrabold text-brand-700 hover:text-brand-900">
                <Facebook size={19} /> تابع صفحة المركز على فيسبوك <ArrowUpLeft size={16} />
              </a>
            )}
          </div>
        </div>

        <form onSubmit={submitForm} className="rounded-[2rem] border border-brand-100 bg-brand-50/60 p-5 sm:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-brand-950">جهّز رسالة استفسار</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">املأ البيانات الأساسية لفتح رسالة واتساب ومراجعتها قبل الإرسال.</p>
          </div>
          
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="name">الاسم</label>
          <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100" placeholder="اكتب اسمك" />
          
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="phone">رقم للتواصل</label>
          <input id="phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mb-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100" placeholder="01xxxxxxxxx" dir="rtl" />
          
          <label className="mb-2 block text-sm font-bold text-slate-700" htmlFor="service">التخصص / نوع الاستفسار</label>
          <div className="relative">
            <select id="service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="mb-5 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100">
              <option>استفسار عام</option>
              {specialties?.map((spec) => (
                <option key={spec._id} value={spec.name}>{spec.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute left-4 top-3.5 text-slate-400" size={18} />
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-4 font-extrabold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800">
            تجهيز رسالة واتساب <ArrowLeft size={18} />
          </button>
          {notice && <p role="status" className="mt-4 rounded-xl bg-white p-3 text-sm leading-6 text-brand-800">{notice}</p>}
        </form>
      </div>
    </section>
  );
}