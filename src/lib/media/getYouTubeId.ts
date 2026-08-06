/**
 * Extract the 11-character video id from common YouTube URL shapes
 * (watch?v=, youtu.be/, embed/, shorts/, v/). Returns null when none is found.
 */
export function getYouTubeId(url: string): string | null {
  if (!url) {
    return null;
  }

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([\w-]{11})/,
  );

  return match ? match[1] : null;
}
