// TODO: Add a periodic drift-correction loop and clean up scheduled work on unmount.
import { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore.js';

const SEEK_THRESHOLD_SECONDS = 0.3;
const SMALL_DRIFT_SECONDS = 0.05;

export function useSyncedPlayer(adapter, roomState, clockOffsetMs = 0) {
  const currentVersion = usePlayerStore((state) => state.version);
  const setVersion = usePlayerStore((state) => state.setVersion);

  useEffect(() => {
    if (!adapter || !roomState) return;
    // Ignore stale snapshots and commands.
    if (roomState.version <= currentVersion) return;

    const estimatedServerNow = Date.now() + clockOffsetMs;
    const elapsed = roomState.isPlaying
      ? Math.max(0, estimatedServerNow - roomState.serverTs) / 1000
      : 0;
    const expected = roomState.positionAtServerTs + elapsed;
    const actual = adapter.getTime();
    const drift = expected - actual;

    if (Math.abs(drift) > SEEK_THRESHOLD_SECONDS) {
      adapter.seek(expected);
    } else if (Math.abs(drift) > SMALL_DRIFT_SECONDS && typeof adapter.setPlaybackRate === 'function') {
      adapter.setPlaybackRate(drift > 0 ? 1.03 : 0.97);
    } else if (typeof adapter.setPlaybackRate === 'function') {
      adapter.setPlaybackRate(1);
    }

    if (roomState.isPlaying) void adapter.play();
    else adapter.pause();

    setVersion(roomState.version);
  }, [adapter, roomState, clockOffsetMs, currentVersion, setVersion]);
}
