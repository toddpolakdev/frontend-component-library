import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { VideoModal, type VideoTrack } from './VideoModal';

/**
 * A stand-in for YT.Player. The real IFrame API needs the network and a live
 * iframe, so the tests drive this instead: it records commands and lets each
 * test fire player events at will.
 */
const { FakePlayer, instances } = vi.hoisted(() => {
  type Events = {
    onReady?: (e: { target: unknown }) => void;
    onStateChange?: (e: { target: unknown; data: number }) => void;
    onPlaybackRateChange?: (e: { target: unknown; data: number }) => void;
    onError?: (e: { target: unknown; data: number }) => void;
  };

  class FakePlayer {
    calls: Array<[string, ...unknown[]]> = [];
    playerState = -1; // UNSTARTED
    currentTime = 0;
    duration = 212;
    volume = 100;
    muted = false;
    rate = 1;
    destroyed = false;
    videoId?: string;
    private events: Events;

    constructor(element: HTMLElement, options: { videoId?: string; events?: Events }) {
      this.videoId = options.videoId;
      this.events = options.events ?? {};

      // The real constructor REPLACES the element it is handed with an iframe.
      const iframe = document.createElement('iframe');
      iframe.title = 'YouTube video player';
      element.replaceWith(iframe);

      instances.push(this);
    }

    private record(name: string, ...args: unknown[]) {
      this.calls.push([name, ...args]);
    }

    /** Test hook: fire onReady. */
    ready() {
      this.events.onReady?.({ target: this });
    }

    /** Test hook: fire onStateChange with a raw IFrame API state code. */
    emitState(state: number) {
      this.playerState = state;
      this.events.onStateChange?.({ target: this, data: state });
    }

    /** Test hook: fire onError with a raw IFrame API error code. */
    emitError(code: number) {
      this.events.onError?.({ target: this, data: code });
    }

    playVideo() {
      this.record('playVideo');
      this.playerState = 1;
    }
    pauseVideo() {
      this.record('pauseVideo');
      this.playerState = 2;
    }
    stopVideo() {
      this.record('stopVideo');
      this.playerState = 5;
    }
    seekTo(seconds: number, allowSeekAhead: boolean) {
      this.record('seekTo', seconds, allowSeekAhead);
      this.currentTime = seconds;
    }
    getCurrentTime() {
      return this.currentTime;
    }
    getDuration() {
      return this.duration;
    }
    getVideoLoadedFraction() {
      return 0.5;
    }
    getPlayerState() {
      return this.playerState;
    }
    setVolume(volume: number) {
      this.record('setVolume', volume);
      this.volume = volume;
    }
    getVolume() {
      return this.volume;
    }
    mute() {
      this.record('mute');
      this.muted = true;
    }
    unMute() {
      this.record('unMute');
      this.muted = false;
    }
    isMuted() {
      return this.muted;
    }
    setPlaybackRate(rate: number) {
      this.record('setPlaybackRate', rate);
      this.rate = rate;
    }
    getPlaybackRate() {
      return this.rate;
    }
    getAvailablePlaybackRates() {
      return [0.5, 1, 1.5, 2];
    }
    getAvailableQualityLevels() {
      return ['hd1080', 'hd720', 'medium'];
    }
    getPlaybackQuality() {
      return 'hd720';
    }
    setPlaybackQuality(quality: string) {
      this.record('setPlaybackQuality', quality);
    }
    loadVideoById(videoId: string) {
      this.record('loadVideoById', videoId);
      this.videoId = videoId;
    }
    cueVideoById(videoId: string) {
      this.record('cueVideoById', videoId);
    }
    getVideoData() {
      return { video_id: this.videoId, title: 'Reported Title', author: 'Reported Channel' };
    }
    getOptions() {
      return [] as string[];
    }
    setOption(module: string, option: string, value: unknown) {
      this.record('setOption', module, option, value);
    }
    destroy() {
      this.record('destroy');
      this.destroyed = true;
    }
  }

  const instances: FakePlayer[] = [];
  return { FakePlayer, instances };
});

vi.mock('../../../lib/media/youtubeApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../lib/media/youtubeApi')>();
  return {
    ...actual,
    // Resolves instantly, so no test ever waits on the real script tag.
    loadYouTubeApi: () => Promise.resolve({ Player: FakePlayer as never }),
  };
});

const RICK = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const SECOND_ID = 'aBcDeFgHiJk';

const PLAYLIST: VideoTrack[] = [
  { id: '1', title: 'First video', url: RICK },
  { id: '2', title: 'Second video', url: `https://youtu.be/${SECOND_ID}` },
];

/** Mounts the player and waits for the fake player to be constructed + ready. */
async function openPlayer(ui: React.ReactElement) {
  const utils = render(ui);

  // Flush the loadYouTubeApi() promise so the player gets created.
  await act(async () => {});

  const player = instances[instances.length - 1];
  if (!player) {
    throw new Error('the player was never constructed');
  }

  await act(async () => {
    player.ready();
  });

  return { ...utils, player };
}

beforeEach(() => {
  instances.length = 0;
  // Pins the autoplay probe and the transport poll so no timer fires unasked.
  vi.useFakeTimers({ shouldAdvanceTime: false });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('VideoModal', () => {
  it('mounts a YouTube player for a valid URL', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    expect(player.videoId).toBe('dQw4w9WgXcQ');
    expect(screen.getByTitle('YouTube video player')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Video player' })).toBeInTheDocument();
  });

  it('renders nothing when given neither a url nor tracks', () => {
    const { container } = render(<VideoModal onClose={() => {}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the link on screen when no video id can be read from it', async () => {
    await openPlayer(<VideoModal url="https://example.com/video" onClose={() => {}} />);

    expect(
      screen.getByText(/Couldn't read a YouTube video ID from this link/),
    ).toBeInTheDocument();
  });

  it('surfaces a playback error reported by the player', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    await act(async () => {
      player.emitError(101);
    });

    expect(screen.getByText('Embedding disabled by owner')).toBeInTheDocument();
  });

  it('closes on the remote power key and on Escape', async () => {
    const onClose = vi.fn();
    await openPlayer(<VideoModal url={RICK} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Power off / close player' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('toggles playback from the glass and from the space bar', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(player.calls).toContainEqual(['playVideo']);

    await act(async () => {
      player.emitState(1); // PLAYING
    });

    // The glass relabels itself, and the space bar hits the same control.
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: ' ' });
    expect(player.calls).toContainEqual(['pauseVideo']);
  });

  it('seeks from the remote and from the arrow keys', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Forward 10 seconds' }));
    expect(player.calls).toContainEqual(['seekTo', 10, true]);

    fireEvent.click(screen.getByRole('button', { name: 'Rewind 30 seconds' }));
    // Clamped at zero rather than seeking negative.
    expect(player.calls).toContainEqual(['seekTo', 0, true]);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(player.calls).toContainEqual(['seekTo', 5, true]);

    fireEvent.click(screen.getByRole('button', { name: 'Jump to 50 percent' }));
    expect(player.calls).toContainEqual(['seekTo', 106, true]);
  });

  it('mutes and unmutes, and reports it on the LCD', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Mute' }));
    expect(player.calls).toContainEqual(['mute']);
    expect(screen.getByText(/MUTE/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'm' });
    expect(player.calls).toContainEqual(['unMute']);
    expect(screen.getByText(/VOL 100/)).toBeInTheDocument();
  });

  it('shows the title and channel the player reports', async () => {
    await openPlayer(<VideoModal url={RICK} title="Fallback title" onClose={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Reported Title' })).toBeInTheDocument();
    expect(screen.getByText('Reported Channel')).toBeInTheDocument();
  });

  it('renders the transport clock from the reported duration', async () => {
    await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    expect(screen.getByText('3:32')).toBeInTheDocument();
  });

  it('disables previous and next for a single video', async () => {
    await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    expect(screen.getByRole('button', { name: 'Previous video' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next video' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Shuffle' })).toBeDisabled();
    expect(screen.getByText('CH 01/01')).toBeInTheDocument();
  });

  it('steps through a playlist without rebuilding the iframe', async () => {
    const { player } = await openPlayer(<VideoModal tracks={PLAYLIST} onClose={() => {}} />);

    expect(screen.getByText('CH 01/02')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next video' }));

    expect(player.calls).toContainEqual(['loadVideoById', SECOND_ID]);
    expect(screen.getByText('CH 02/02')).toBeInTheDocument();
    // Same player instance: no second construction, so no black reload flash.
    expect(instances).toHaveLength(1);

    fireEvent.keyDown(window, { key: 'p' });
    expect(screen.getByText('CH 01/02')).toBeInTheDocument();
  });

  it('advances to the next track when a video ends', async () => {
    const { player } = await openPlayer(<VideoModal tracks={PLAYLIST} onClose={() => {}} />);

    await act(async () => {
      player.emitState(0); // ENDED
    });

    expect(player.calls).toContainEqual(['loadVideoById', SECOND_ID]);
    expect(screen.getByText('CH 02/02')).toBeInTheDocument();
  });

  it('replays the same video when loop is on instead of advancing', async () => {
    const { player } = await openPlayer(<VideoModal tracks={PLAYLIST} onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Loop' }));

    await act(async () => {
      player.emitState(0); // ENDED
    });

    expect(player.calls).toContainEqual(['seekTo', 0, true]);
    expect(player.calls).not.toContainEqual(['loadVideoById', SECOND_ID]);
    expect(screen.getByText('CH 01/02')).toBeInTheDocument();
  });

  it('changes playback rate and quality from the remote', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText('Playback speed'), { target: { value: '1.5' } });
    expect(player.calls).toContainEqual(['setPlaybackRate', 1.5]);

    fireEvent.change(screen.getByLabelText('Video quality'), { target: { value: 'hd1080' } });
    expect(player.calls).toContainEqual(['setPlaybackQuality', 'hd1080']);
  });

  it('leaves keys aimed at the remote sliders alone', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    fireEvent.keyDown(screen.getByLabelText('Volume'), { key: 'ArrowRight' });

    // The keyboard shortcut must not also seek while a slider has focus.
    expect(player.calls).not.toContainEqual(['seekTo', 5, true]);
  });

  it('collapses and expands the remote', async () => {
    await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse remote' }));
    expect(screen.queryByRole('button', { name: 'Play or pause' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand remote' }));
    expect(screen.getByRole('button', { name: 'Play or pause' })).toBeInTheDocument();
  });

  it('falls back to muted playback when the browser blocks autoplay', async () => {
    const { player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    // Still UNSTARTED when the probe fires: autoplay with sound was refused.
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(player.calls).toContainEqual(['mute']);
    expect(screen.getByText(/Muted by your browser/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Muted by your browser/ }));
    expect(player.calls).toContainEqual(['unMute']);
  });

  it('swaps the remote for a close button when showRemote is false', async () => {
    const onClose = vi.fn();
    const { player } = await openPlayer(
      <VideoModal url={RICK} showRemote={false} onClose={onClose} />,
    );

    expect(screen.queryByRole('group', { name: 'Player remote' })).not.toBeInTheDocument();

    // The screen and the keyboard still drive playback.
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(player.calls).toContainEqual(['playVideo']);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(player.calls).toContainEqual(['seekTo', 5, true]);

    fireEvent.click(screen.getByRole('button', { name: 'Close video' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows the remote by default', async () => {
    await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);

    expect(screen.getByRole('group', { name: 'Player remote' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close video' })).not.toBeInTheDocument();
  });

  it('locks page scrolling while open and restores it on close', async () => {
    document.body.style.overflow = 'scroll';

    const { unmount, player } = await openPlayer(<VideoModal url={RICK} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('scroll');
    expect(player.destroyed).toBe(true);
  });
});
