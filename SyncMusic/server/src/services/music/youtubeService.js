import { cachedSearch } from './searchCache.js';

export async function searchYouTube(query, page = 1) {
  const key = `youtube:${query}:${page}`;
  return cachedSearch(key, Number(process.env.SEARCH_CACHE_TTL_SECONDS || 300), async () => {
    // TODO: Use server-only credential, quota-aware pagination and video embeddability checks.
    const endpoint = 'https://www.googleapis.com/youtube/v3/search';
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return { source: 'youtube', items: [], configured: false };
    const url = new URL(endpoint);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', '20');
    url.searchParams.set('pageToken', page > 1 ? String(page) : '');
    url.searchParams.set('key', apiKey);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Video search failed');
    return { source: 'youtube', items: (await response.json()).items ?? [] };
  });
}
