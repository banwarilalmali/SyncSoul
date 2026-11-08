import axios from 'axios';

// TODO: Keep provider credentials out of the browser; this client calls only our API.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  withCredentials: true,
  timeout: 15000
});
