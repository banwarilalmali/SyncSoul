import { api } from './api.js';
// TODO: Search providers only through our server-side aggregator and cached results.
export const searchMusic = async ({ query, source, page = 1 }) => {
  const { data } = await api.get('/music/search', { params: { query, source, page } });
  return data;
};
