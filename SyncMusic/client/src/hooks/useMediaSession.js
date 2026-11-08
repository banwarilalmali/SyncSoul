import { useEffect } from 'react';

// TODO: Wire this hook to the active adapter and room-wide playback commands.
export function useMediaSession(track, actions = {}) {
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || 'Unknown track',
      artist: track.artist || 'Unknown artist',
      album: 'SyncMusic',
      artwork: track.artworkUrl ? [{ src: track.artworkUrl, sizes: '512x512', type: 'image/png' }] : []
    });

    const handlers = {
      play: actions.play,
      pause: actions.pause,
      nexttrack: actions.next,
      previoustrack: actions.previous,
      seekto: actions.seek
    };
    for (const [name, handler] of Object.entries(handlers)) {
      if (handler) navigator.mediaSession.setActionHandler(name, handler);
    }
    return () => {
      for (const name of Object.keys(handlers)) {
        try { navigator.mediaSession.setActionHandler(name, null); } catch { /* Unsupported action. */ }
      }
    };
  }, [track, actions]);
}
