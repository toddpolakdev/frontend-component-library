import { describe, expect, it } from 'vitest';

import { formatTime, loadYouTubeApi, PlayerState, qualityLabel } from './youtubeApi';

describe('formatTime', () => {
  it('formats under an hour as m:ss', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(9)).toBe('0:09');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(599)).toBe('9:59');
  });

  it('formats an hour or more as h:mm:ss', () => {
    expect(formatTime(3600)).toBe('1:00:00');
    expect(formatTime(3723)).toBe('1:02:03');
  });

  it('clamps junk input to zero rather than rendering NaN', () => {
    expect(formatTime(Number.NaN)).toBe('0:00');
    expect(formatTime(Number.POSITIVE_INFINITY)).toBe('0:00');
    expect(formatTime(-30)).toBe('0:00');
  });
});

describe('qualityLabel', () => {
  it('maps YouTube quality keys to human labels', () => {
    expect(qualityLabel('hd1080')).toBe('1080p');
    expect(qualityLabel('tiny')).toBe('144p');
    expect(qualityLabel('default')).toBe('Auto');
  });

  it('passes through an unknown key unchanged', () => {
    expect(qualityLabel('hd4320')).toBe('hd4320');
  });
});

describe('PlayerState', () => {
  it('mirrors the IFrame API state codes', () => {
    expect(PlayerState).toMatchObject({
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 5,
    });
  });
});

describe('loadYouTubeApi', () => {
  it('resolves immediately when the API is already on the page', async () => {
    // The loader never injects a script in this case, so nothing hits network.
    const fakeNamespace = { Player: function Player() {} as unknown } as never;
    window.YT = fakeNamespace;

    await expect(loadYouTubeApi()).resolves.toBe(fakeNamespace);

    delete window.YT;
  });
});
