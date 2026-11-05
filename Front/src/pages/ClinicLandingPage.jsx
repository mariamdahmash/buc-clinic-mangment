import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClinicDataBySlug } from '../api/publicApi';
import Header from '../components/common/Header';
import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import DoctorsSection from '../components/landing/DoctorsSection';
import SpecialtiesSection from '../components/landing/SpecialtiesSection';
import ContactForm from '../components/landing/ContactForm';
import Footer from '../components/common/Footer';

export default function ClinicLandingPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchClinicDataBySlug(slug)
      .then((res) => {
        setData(res);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex h-screen items-center justify-center font-bold">جاري تحميل بيانات العيادة...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-600 font-bold">{error}</div>;

  const { clinic, specialties,services, doctors } = data;

  return (
    <div id="home" className="min-h-screen bg-white text-slate-800">
      <Header clinic={clinic} />
      <main>
        <HeroSection clinic={clinic} />
        <SpecialtiesSection specialties={specialties} />
        <ServicesSection services={services} />
        <DoctorsSection doctors={doctors} />
        <ContactForm clinic={clinic} specialties={specialties} />
      </main>
      <Footer clinic={clinic} />
    </div>
  );
}