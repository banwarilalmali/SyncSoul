import { PlayerAdapter } from './PlayerAdapter.js';

// This adapter wraps a visible official embedded player supplied by the room UI.
export default class VideoAdapter extends PlayerAdapter {
  constructor(player) {
    super();
    this.player = player;
  }
  async load(track) {
    // TODO: Load the server-approved video identifier into the visible embedded player.
    this.player.loadVideoById(track.sourceId);
  }
  async play() { this.player.playVideo(); }
  pause() { this.player.pauseVideo(); }
  seek(seconds) { this.player.seekTo(seconds, true); }
  getTime() { return this.player.getCurrentTime() || 0; }
  setPlaybackRate(rate) { this.player.setPlaybackRate(rate); }
  onEnded(callback) {
    // TODO: Bind and clean up the embedded player's ended-state callback.
    this.endedCallback = callback;
    return () => { this.endedCallback = null; };
  }
}
