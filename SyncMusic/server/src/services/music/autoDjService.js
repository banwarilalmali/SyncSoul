// Rule-based Auto DJ: prefer the same artist, genre or overlapping tags; never ML.
export function chooseAutoDjCandidate(candidates = [], recentIds = [], currentTrack = null) {
  const recent = new Set(recentIds);
  const eligible = candidates.filter((track) =>
    !recent.has(track.sourceId) && track.sourceId !== currentTrack?.sourceId
  );
  if (!currentTrack) return eligible[0] ?? null;

  const currentTags = new Set(currentTrack.tags ?? []);
  const currentGenre = String(currentTrack.genre ?? '').toLowerCase();
  const currentArtist = String(currentTrack.artist ?? '').toLowerCase();

  const score = (track) => {
    let value = 0;
    if (currentArtist && String(track.artist ?? '').toLowerCase() === currentArtist) value += 4;
    if (currentGenre && String(track.genre ?? '').toLowerCase() === currentGenre) value += 3;
    value += (track.tags ?? []).filter((tag) => currentTags.has(tag)).length;
    return value;
  };

  return eligible
    .map((track) => ({ track, score: score(track) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.track ?? eligible[0] ?? null;
}
// TODO: Feed candidates from cached provider search and persist recent-play history with the room queue.
