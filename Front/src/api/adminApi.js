import { apiRequest } from './http';

export const getClinics = (token) => apiRequest('/clinics', { token });
export const createClinic = (token, body) => apiRequest('/clinics', { method: 'POST', token, body });
export const getSpecialties = (token) => apiRequest('/specialties', { token });
export const createSpecialty = (token, body) => apiRequest('/specialties', { method: 'POST', token, body });
export const toggleSpecialty = (token, id) => apiRequest(`/specialties/${id}/toggle-status`, { method: 'PATCH', token });
export const getDoctors = (token) => apiRequest('/doctors', { token });
export const createDoctor = (token, body) => apiRequest('/doctors', { method: 'POST', token, body });
