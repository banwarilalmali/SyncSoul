/**
 * TODO: Keep this common contract identical for every playback engine.
 * load(track), play(), pause(), seek(seconds), getTime(), onEnded(callback).
 */
export class PlayerAdapter {
  async load(_track) { throw new Error('TODO: implement load'); }
  async play() { throw new Error('TODO: implement play'); }
  pause() { throw new Error('TODO: implement pause'); }
  seek(_seconds) { throw new Error('TODO: implement seek'); }
  getTime() { throw new Error('TODO: implement getTime'); }
  onEnded(_callback) { throw new Error('TODO: implement onEnded'); }
}
