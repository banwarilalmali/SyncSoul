// TODO: Clock-offset sampling, snapshot distribution and drift correction orchestration.
export function expectedPosition(snapshot, now = Date.now()) {
  if (!snapshot?.isPlaying) return snapshot?.positionAtServerTs ?? 0;
  return snapshot.positionAtServerTs + Math.max(0, now - snapshot.serverTs) / 1000;
}
export const SEEK_DRIFT_THRESHOLD_SECONDS = 0.3;
