import { cachedSearch } from './searchCache.js';

const API_BASE = (process.env.AUDIUS_API_BASE || 'https://api.audius.co/v1').replace(/\/+$/, '');

function normalizeTrack(track) {
  const id = String(track?.id || '');
  if (!id) return null;
  const artwork = track.artwork || {};
  return {
    source: 'audius',
    sourceId: id,
    title: String(track.title || 'Untitled track').slice(0, 160),
    artist: String(track.user?.name || track.user?.handle || 'Audius artist').slice(0, 120),
    duration: Math.max(0, Number(track.duration) || 0),
    artworkUrl: artwork['480x480'] || artwork['150x150'] || artwork['1000x1000'] || '',
    streamUrl: `${API_BASE}/tracks/${encodeURIComponent(id)}/stream?app_name=SyncMusic`,
    permalink: track.permalink ? `https://audius.co${track.permalink}` : ''
  };
}

export async function searchAudius(query, page = 1) {
  const normalizedQuery = String(query || '').trim().slice(0, 120);
  if (!normalizedQuery) return { source: 'audius', items: [] };
  const pageNumber = Math.max(1, Number(page) || 1);
  const key = `audius:${normalizedQuery.toLowerCase()}:${pageNumber}`;
  return cachedSearch(key, Number(process.env.SEARCH_CACHE_TTL_SECONDS || 300), async () => {
    const url = new URL(`${API_BASE}/tracks/search`);
    url.searchParams.set('query', normalizedQuery);
    url.searchParams.set('limit', '20');
    url.searchParams.set('offset', String((pageNumber - 1) * 20));
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`Audius search returned ${response.status}`);
    const payload = await response.json();
    return {
      source: 'audius',
      items: (payload.data || []).map(normalizeTrack).filter(Boolean),
      page: pageNumber
    };
  });
}
