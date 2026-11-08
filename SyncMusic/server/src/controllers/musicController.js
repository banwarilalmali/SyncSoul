import { searchMusicProvider } from '../services/music/index.js';

export async function searchMusic(req, res, next) {
  try {
    const result = await searchMusicProvider(req.query);
    res.set('Cache-Control', 'private, max-age=60');
    res.json(result);
  } catch (error) {
    next(error);
  }
}
