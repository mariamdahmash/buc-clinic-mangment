import { apiRequest } from './http';

export const login = (credentials) => apiRequest('/auth/login', {
  method: 'POST',
  body: credentials,
});
