import { apiRequest } from './http';
export const fetchClinicDataBySlug = slug => apiRequest(`/public/clinics/${encodeURIComponent(slug)}`);
