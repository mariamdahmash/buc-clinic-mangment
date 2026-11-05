const BASE_URL = 'http://localhost:5000/api/v1/public';

export const fetchClinicDataBySlug = async (slug) => {
  const response = await fetch(`${BASE_URL}/clinics/${slug}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'فشل في جلب بيانات العيادة');
  }

  return data.data; // بيرجع { clinic, specialties, doctors }
};