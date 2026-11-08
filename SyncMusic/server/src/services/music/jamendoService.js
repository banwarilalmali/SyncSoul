import { cachedSearch } from './searchCache.js';
import { env } from '../../config/env.js';

export async function searchJamendo(query, page = 1) {
  const key = `jamendo:${query}:${page}`;
  return cachedSearch(key, Number(process.env.SEARCH_CACHE_TTL_SECONDS || 300), async () => {
    // TODO: Call provider endpoint from the server with credentials and normalize permitted stream metadata.
    const endpoint = 'https://api.jamendo.com/v3.0/tracks/';
    if (!process.env.JAMENDO_CLIENT_ID) return { source: 'jamendo', items: [], configured: false };
    const url = new URL(endpoint);
    url.searchParams.set('client_id', process.env.JAMENDO_CLIENT_ID);
    url.searchParams.set('format', 'json');
    url.searchParams.set('namesearch', query);
    url.searchParams.set('limit', '20');
    url.searchParams.set('offset', String((page - 1) * 20));
    const response = await fetch(url);
    if (!response.ok) throw new Error('Jamendo search failed');
    return { source: 'jamendo', items: (await response.json()).results ?? [] };
  });
}
