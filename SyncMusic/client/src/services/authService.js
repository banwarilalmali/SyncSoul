import { api } from './api.js';
export const login = (payload) => api.post('/auth/login', payload);
export const signup = (payload) => api.post('/auth/signup', payload);
export const logout = () => api.post('/auth/logout');
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (payload) => api.post('/auth/reset-password', payload);
// TODO: Add session restoration and email verification endpoints.
