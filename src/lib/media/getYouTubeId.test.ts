import { describe, expect, it } from 'vitest';

import { getYouTubeId } from './getYouTubeId';

describe('getYouTubeId', () => {
  it('extracts the id from a standard watch URL', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts the id from a short youtu.be URL', () => {
    expect(getYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts the id from an embed URL with query params', () => {
    expect(getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('handles extra query params before v=', () => {
    expect(getYouTubeId('https://www.youtube.com/watch?list=abc&v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('extracts the id from shorts, live and /v/ paths', () => {
    expect(getYouTubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeId('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('accepts the m. and music. subdomains and the nocookie host', () => {
    expect(getYouTubeId('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeId('https://music.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeId('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ',
    );
  });

  it('accepts a bare id and a link pasted without a scheme', () => {
    expect(getYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeId('  dQw4w9WgXcQ  ')).toBe('dQw4w9WgXcQ');
    expect(getYouTubeId('youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('ignores tracking params on a youtu.be link', () => {
    expect(getYouTubeId('https://youtu.be/dQw4w9WgXcQ?si=AbCdEfGh&t=42')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-YouTube or empty input', () => {
    expect(getYouTubeId('https://example.com/video')).toBeNull();
    expect(getYouTubeId('')).toBeNull();
  });

  it('returns null for a YouTube URL with no video id', () => {
    expect(getYouTubeId('https://www.youtube.com/results?search_query=cats')).toBeNull();
    expect(getYouTubeId('https://www.youtube.com/watch?v=tooshort')).toBeNull();
  });

  it('does not match a look-alike host', () => {
    expect(getYouTubeId('https://notyoutube.com/watch?v=dQw4w9WgXcQ')).toBeNull();
  });
});
