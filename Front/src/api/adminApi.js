import { apiRequest } from './http';
export const getClinics = token => apiRequest('/clinics', {token});
export const createClinic = (token, body) => apiRequest('/clinics', {method:'POST',token,body});
