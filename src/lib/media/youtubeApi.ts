/**
 * Minimal typings + a singleton loader for the YouTube IFrame Player API.
 *
 * We hand-roll the types instead of pulling in @types/youtube: we only touch a
 * small slice of the API, and the undocumented-but-stable bits (getVideoData)
 * aren't in the official typings anyway.
 */

export type YTPlayerState = -1 | 0 | 1 | 2 | 3 | 5;

export const PlayerState = {
  UNSTARTED: -1 as const,
  ENDED: 0 as const,
  PLAYING: 1 as const,
  PAUSED: 2 as const,
  BUFFERING: 3 as const,
  CUED: 5 as const,
};

export type YTVideoData = {
  video_id?: string;
  title?: string;
  author?: string;
};

export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  getPlayerState(): YTPlayerState;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];
  getAvailableQualityLevels(): string[];
  getPlaybackQuality(): string;
  setPlaybackQuality(quality: string): void;
  loadVideoById(videoId: string, startSeconds?: number): void;
  cueVideoById(videoId: string, startSeconds?: number): void;
  getVideoData?(): YTVideoData;
  setOption?(module: string, option: string, value: unknown): void;
  getOptions?(module?: string): string[];
  getIframe?(): HTMLIFrameElement;
  destroy(): void;
}

type YTPlayerCtor = new (
  element: HTMLElement | string,
  options: {
    videoId?: string;
    host?: string;
    width?: string | number;
    height?: string | number;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (e: { target: YTPlayer }) => void;
      onStateChange?: (e: { target: YTPlayer; data: YTPlayerState }) => void;
      onPlaybackRateChange?: (e: { target: YTPlayer; data: number }) => void;
      onError?: (e: { target: YTPlayer; data: number }) => void;
    };
  },
) => YTPlayer;

export type YTNamespace = { Player: YTPlayerCtor };

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** How long to wait for the API before declaring it dead. */
const LOAD_TIMEOUT_MS = 12000;

/**
 * Injects the IFrame API script once and resolves when YT.Player exists.
 *
 * Rejects loudly on failure rather than hanging. In production this script can
 * be blocked by a Content-Security-Policy `script-src`, an ad/tracker blocker,
 * or a corporate proxy — none of which happen in local dev. A promise that
 * never settles turns any of those into a permanently black screen with
 * nothing in the console, which is the worst possible thing to debug.
 */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) {
    return apiPromise;
  }

  const pending = new Promise<YTNamespace>((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const timer = window.setTimeout(
      () =>
        reject(
          new Error(
            'Timed out loading the YouTube player API — check for a CSP script-src rule or a content blocker.',
          ),
        ),
      LOAD_TIMEOUT_MS,
    );

    // Chain rather than clobber — another consumer may already be waiting.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      window.clearTimeout(timer);
      resolve(window.YT as YTNamespace);
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    tag.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error('Could not load the YouTube player API (request failed).'));
    };
    document.head.appendChild(tag);
  });

  // Don't cache a failure forever — let the next open retry.
  apiPromise = pending;
  pending.catch(() => {
    apiPromise = null;
  });

  return pending;
}

const QUALITY_LABELS: Record<string, string> = {
  highres: '4K+',
  hd2160: '2160p',
  hd1440: '1440p',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
  auto: 'Auto',
  default: 'Auto',
};

export const qualityLabel = (quality: string): string => QUALITY_LABELS[quality] ?? quality;

/** 0:00 / 1:02:03 style clock. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    seconds = 0;
  }

  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}
