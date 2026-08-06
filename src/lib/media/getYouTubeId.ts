/** A YouTube video id is always exactly 11 URL-safe characters. */
const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** Path prefixes that put the id in the next segment: /shorts/ID, /embed/ID … */
const ID_BEARING_SEGMENTS = ['shorts', 'embed', 'live', 'v', 'e'];

const YOUTUBE_HOSTS = /(^|\.)(youtube\.com|youtube-nocookie\.com)$/;

/**
 * Extracts the video id from any shape of YouTube link.
 *
 * Handles watch?v=, youtu.be, /shorts/, /embed/, /live/, /v/, m. and music.
 * subdomains, the nocookie host, tracking params (?si=…), and a bare id.
 * Returns null for anything it can't identify — callers must surface that
 * rather than passing null to the player, which just renders black.
 */
export function getYouTubeId(input: string): string | null {
  if (!input) {
    return null;
  }

  const raw = input.trim();

  // Already just an id.
  if (ID_PATTERN.test(raw)) {
    return raw;
  }

  let url: URL;
  try {
    // Tolerate "youtube.com/watch?v=…" pasted without a scheme.
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') {
    const candidate = segments[0];
    return candidate && ID_PATTERN.test(candidate) ? candidate : null;
  }

  if (!YOUTUBE_HOSTS.test(host)) {
    return null;
  }

  // ?v= wins, and survives extra params like &list= or &t=.
  const v = url.searchParams.get('v');
  if (v && ID_PATTERN.test(v)) {
    return v;
  }

  const marker = segments.findIndex((segment) => ID_BEARING_SEGMENTS.includes(segment));
  if (marker !== -1) {
    const candidate = segments[marker + 1];
    if (candidate && ID_PATTERN.test(candidate)) {
      return candidate;
    }
  }

  return null;
}
