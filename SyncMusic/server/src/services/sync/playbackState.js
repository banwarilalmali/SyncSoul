// Canonical room playback snapshot. Mutations must increment version.
export function createPlaybackState() {
  return { trackId: null, isPlaying: false, positionAtServerTs: 0, serverTs: Date.now(), version: 0 };
}
export function updatePlaybackState(state, patch) {
  return { ...state, ...patch, serverTs: Date.now(), version: state.version + 1 };
}
// TODO: Compute projected position from server timestamp and enforce monotonic versions.
