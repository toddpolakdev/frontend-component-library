import { useCallback, useEffect, useRef, useState } from 'react';

import {
  loadYouTubeApi,
  PlayerState,
  type YTPlayer,
  type YTPlayerState,
} from '../../../lib/media/youtubeApi';

export type PlayerSnapshot = {
  ready: boolean;
  playing: boolean;
  buffering: boolean;
  ended: boolean;
  currentTime: number;
  duration: number;
  loaded: number; // 0..1 buffered fraction
  volume: number; // 0..100
  muted: boolean;
  rate: number;
  rates: number[];
  quality: string;
  qualities: string[];
  captions: boolean;
  title: string;
  author: string;
  error: string | null;
  /** True when the browser refused unmuted autoplay and we fell back to muted. */
  autoplayBlocked: boolean;
};

const INITIAL: PlayerSnapshot = {
  ready: false,
  playing: false,
  buffering: false,
  ended: false,
  currentTime: 0,
  duration: 0,
  loaded: 0,
  volume: 100,
  muted: false,
  rate: 1,
  rates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  quality: 'auto',
  qualities: [],
  captions: false,
  title: '',
  author: '',
  error: null,
  autoplayBlocked: false,
};

const ERRORS: Record<number, string> = {
  2: 'Invalid video id',
  5: 'Playback error',
  100: 'Video not found or private',
  101: 'Embedding disabled by owner',
  150: 'Embedding disabled by owner',
};

type Options = {
  videoId: string | null;
  /** Fired when the current video reaches the end (after loop handling). */
  onEnded?: () => void;
  loop?: boolean;
};

/**
 * Owns a YT.Player instance mounted into the returned ref, and mirrors its
 * state into React so the remote can render live readouts.
 */
export function useYouTubePlayer({ videoId, onEnded, loop }: Options) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [state, setState] = useState<PlayerSnapshot>(INITIAL);

  // Kept in refs so the player's event handlers always see current values
  // without needing to be torn down and rebuilt.
  const loopRef = useRef(loop);
  const onEndedRef = useRef(onEnded);
  loopRef.current = loop;
  onEndedRef.current = onEnded;

  const patch = useCallback((next: Partial<PlayerSnapshot>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  /** Pulls everything the player will tell us about the loaded video. */
  const syncMeta = useCallback(
    (player: YTPlayer) => {
      let title = '';
      let author = '';
      try {
        const data = player.getVideoData?.();
        title = data?.title ?? '';
        author = data?.author ?? '';
      } catch {
        /* getVideoData is undocumented; never let it break playback */
      }

      let captions = false;
      try {
        captions = (player.getOptions?.('captions')?.length ?? 0) > 0;
      } catch {
        /* captions module may not be loaded yet */
      }

      patch({
        duration: player.getDuration(),
        volume: player.getVolume(),
        muted: player.isMuted(),
        rate: player.getPlaybackRate(),
        rates: player.getAvailablePlaybackRates(),
        qualities: player.getAvailableQualityLevels(),
        quality: player.getPlaybackQuality(),
        captions,
        title,
        author,
      });
    },
    [patch],
  );

  // Create the player once, then reuse it across video changes.
  useEffect(() => {
    let cancelled = false;
    let autoplayProbe = 0;

    loadYouTubeApi().then(
      (YT) => {
        if (cancelled || !mountRef.current || playerRef.current) {
          return;
        }

        // YT.Player REPLACES the element it is given with the <iframe>. Hand it
        // a throwaway child so it never destroys the React-managed wrapper —
        // otherwise the wrapper's styles vanish (the iframe renders at its
        // default 640x360 instead of filling the glass) and React crashes on
        // unmount trying to removeChild a node that is no longer its child.
        const seat = document.createElement('div');
        mountRef.current.appendChild(seat);

        playerRef.current = new YT.Player(seat, {
          videoId: videoId ?? undefined,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 0, // the remote is the only control surface
            disablekb: 1, // we own the keyboard
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3, // no annotation cards
            playsinline: 1,
            fs: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) {
                return;
              }

              patch({ ready: true });
              syncMeta(event.target);

              // Autoplay with sound is blocked on any origin the browser has
              // no media-engagement history for. localhost accumulates that
              // history during development, so this only ever bites in prod.
              // If nothing started, retry muted and tell the user why.
              autoplayProbe = window.setTimeout(() => {
                if (cancelled) {
                  return;
                }

                const playerState = event.target.getPlayerState();
                if (
                  playerState === PlayerState.UNSTARTED ||
                  playerState === PlayerState.CUED
                ) {
                  event.target.mute();
                  event.target.playVideo();
                  patch({ muted: true, autoplayBlocked: true });
                }
              }, 1500);
            },
            onStateChange: (event) => {
              if (cancelled) {
                return;
              }

              const playerState: YTPlayerState = event.data;
              patch({
                playing: playerState === PlayerState.PLAYING,
                buffering: playerState === PlayerState.BUFFERING,
                ended: playerState === PlayerState.ENDED,
                error: null,
              });

              if (playerState === PlayerState.PLAYING || playerState === PlayerState.CUED) {
                syncMeta(event.target);
              }

              if (playerState === PlayerState.ENDED) {
                if (loopRef.current) {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } else {
                  onEndedRef.current?.();
                }
              }
            },
            onPlaybackRateChange: (event) => patch({ rate: event.data }),
            onError: (event) =>
              patch({
                error: ERRORS[event.data] ?? 'Playback error',
                playing: false,
              }),
          },
        });
      },
      // Surface a dead API load on the screen instead of showing black forever.
      (error: Error) => {
        if (!cancelled) {
          patch({ error: error.message });
        }
      },
    );

    return () => {
      cancelled = true;
      window.clearTimeout(autoplayProbe);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Intentionally mount-only: video changes are handled by loadVideoById.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap videos without tearing down the iframe (avoids a black reload flash).
  const loadedIdRef = useRef(videoId);
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !state.ready || !videoId || loadedIdRef.current === videoId) {
      loadedIdRef.current = videoId;
      return;
    }

    loadedIdRef.current = videoId;
    patch({ currentTime: 0, duration: 0, loaded: 0, ended: false, error: null });
    player.loadVideoById(videoId);
  }, [videoId, state.ready, patch]);

  // Poll the transport clock. The API has no timeupdate event.
  useEffect(() => {
    if (!state.ready) {
      return;
    }

    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) {
        return;
      }

      try {
        patch({
          currentTime: player.getCurrentTime(),
          duration: player.getDuration(),
          loaded: player.getVideoLoadedFraction(),
        });
      } catch {
        /* player torn down mid-tick */
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [state.ready, patch]);

  const withPlayer = useCallback((fn: (player: YTPlayer) => void) => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    try {
      fn(player);
    } catch {
      /* commands can throw if the iframe is mid-navigation */
    }
  }, []);

  const controls = {
    play: useCallback(() => withPlayer((player) => player.playVideo()), [withPlayer]),
    pause: useCallback(() => withPlayer((player) => player.pauseVideo()), [withPlayer]),
    toggle: useCallback(
      () =>
        withPlayer((player) =>
          player.getPlayerState() === PlayerState.PLAYING
            ? player.pauseVideo()
            : player.playVideo(),
        ),
      [withPlayer],
    ),
    stop: useCallback(
      () =>
        withPlayer((player) => {
          player.stopVideo();
          patch({ playing: false, currentTime: 0 });
        }),
      [withPlayer, patch],
    ),
    seekTo: useCallback(
      (seconds: number) =>
        withPlayer((player) => {
          player.seekTo(Math.max(0, seconds), true);
          patch({ currentTime: Math.max(0, seconds) });
        }),
      [withPlayer, patch],
    ),
    /** Negative values rewind. */
    nudge: useCallback(
      (delta: number) =>
        withPlayer((player) => {
          const next = Math.max(0, player.getCurrentTime() + delta);
          player.seekTo(next, true);
          patch({ currentTime: next });
        }),
      [withPlayer, patch],
    ),
    /** Jump to a 0..1 fraction of the video (the 0-9 keypad). */
    seekFraction: useCallback(
      (fraction: number) =>
        withPlayer((player) => {
          const next = player.getDuration() * fraction;
          player.seekTo(next, true);
          patch({ currentTime: next });
        }),
      [withPlayer, patch],
    ),
    setVolume: useCallback(
      (volume: number) =>
        withPlayer((player) => {
          const next = Math.min(100, Math.max(0, Math.round(volume)));
          player.setVolume(next);
          if (next > 0 && player.isMuted()) {
            player.unMute();
          }
          patch({
            volume: next,
            muted: next === 0,
            ...(next > 0 ? { autoplayBlocked: false } : {}),
          });
        }),
      [withPlayer, patch],
    ),
    toggleMute: useCallback(
      () =>
        withPlayer((player) => {
          const next = !player.isMuted();
          if (next) {
            player.mute();
          } else {
            player.unMute();
            // Unmuting is a user gesture; make sure playback actually starts.
            if (player.getPlayerState() !== PlayerState.PLAYING) {
              player.playVideo();
            }
          }
          patch({ muted: next, autoplayBlocked: false });
        }),
      [withPlayer, patch],
    ),
    setRate: useCallback(
      (rate: number) =>
        withPlayer((player) => {
          player.setPlaybackRate(rate);
          patch({ rate });
        }),
      [withPlayer, patch],
    ),
    setQuality: useCallback(
      (quality: string) =>
        withPlayer((player) => {
          player.setPlaybackQuality(quality);
          patch({ quality });
        }),
      [withPlayer, patch],
    ),
    toggleCaptions: useCallback(
      () =>
        withPlayer((player) => {
          setState((prev) => {
            const next = !prev.captions;
            // Module name differs by player build; setting both is harmless.
            for (const module of ['captions', 'cc']) {
              try {
                player.setOption?.(module, 'track', next ? { languageCode: 'en' } : {});
              } catch {
                /* module not present in this player build */
              }
            }
            return { ...prev, captions: next };
          });
        }),
      [withPlayer],
    ),
  };

  return { mountRef, state, controls };
}

export type PlayerControls = ReturnType<typeof useYouTubePlayer>['controls'];
