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

  it('returns null for non-YouTube or empty input', () => {
    expect(getYouTubeId('https://example.com/video')).toBeNull();
    expect(getYouTubeId('')).toBeNull();
  });
});
