import { searchJamendo } from './jamendoService.js';
import { searchAudius } from './audiusService.js';
import { searchYouTube } from './youtubeService.js';

export async function searchMusicProvider({ query, source = 'audius', page = 1 }) {
  if (source === 'audius' || source === 'audio-b') return searchAudius(query, page);
  if (source === 'jamendo' || source === 'audio-a') return searchJamendo(query, page);
  if (source === 'youtube' || source === 'video') return searchYouTube(query, page);
  throw new Error('Unsupported music source');
}
