import { PlayerAdapter } from './PlayerAdapter.js';

export class HtmlAudioAdapter extends PlayerAdapter {
  constructor(audio = new Audio()) {
    super();
    this.audio = audio;
  }
  async load(track) {
    // TODO: Validate a server-provided permitted stream URL before assigning it.
    this.audio.src = track.streamUrl;
    this.audio.load();
  }
  async play() { return this.audio.play(); }
  pause() { this.audio.pause(); }
  seek(seconds) { this.audio.currentTime = Math.max(0, seconds); }
  getTime() { return this.audio.currentTime || 0; }
  onEnded(callback) { this.audio.addEventListener('ended', callback); return () => this.audio.removeEventListener('ended', callback); }
  setPlaybackRate(rate) { this.audio.playbackRate = rate; }
}
