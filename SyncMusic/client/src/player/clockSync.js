// TODO: Estimate client/server clock offset with multiple ping/pong samples.
export function estimateClockOffset(samples = []) {
  if (!samples.length) return 0;
  const sorted = [...samples].sort((a, b) => a.roundTripMs - b.roundTripMs);
  return sorted[0].serverTime - sorted[0].clientMidpoint;
}
