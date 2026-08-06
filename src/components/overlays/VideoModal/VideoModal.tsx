import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getYouTubeId } from '../../../lib/media/getYouTubeId';
import { Remote } from './Remote';
import { TvScreen } from './TvScreen';
import { useYouTubePlayer } from './useYouTubePlayer';
import { Caption, CloseButton, Hint, Overlay, ScreenSlot } from './VideoModal.styles';

export interface VideoTrack {
  id: string;
  title: string;
  url: string;
}

export interface VideoModalProps {
  /** A single video: full YouTube URL of any shape, or a bare 11-char id. */
  url?: string;
  /** Caption for the single-video form until YouTube reports the real title. */
  title?: string;
  /**
   * A playlist. Takes precedence over `url`, and enables previous/next,
   * shuffle, and auto-advance at the end of each video.
   */
  tracks?: VideoTrack[];
  /** Which entry of `tracks` to open on. */
  startIndex?: number;
  /**
   * Show the draggable remote. With it hidden the overlay keeps a close button,
   * click-to-toggle on the screen, and the full keyboard shortcut set — but
   * volume, speed, quality, captions and track changes become keyboard-only.
   */
  showRemote?: boolean;
  onClose: () => void;
}

/**
 * A full-screen YouTube player: a CSS-3D flat panel on a plain dark scrim,
 * driven by a draggable hardware-style remote and the keyboard.
 *
 * The panel is native `perspective` + `preserve-3d` with no 3D library on
 * purpose — a cross-origin YouTube iframe can never be a WebGL texture, so
 * Three.js would only ever render a black mesh here. Playback runs through the
 * YouTube IFrame Player API (see `lib/media/youtubeApi`), which is what lets
 * the remote drive real controls while YouTube's own chrome stays hidden.
 */
export function VideoModal({
  url,
  title,
  tracks,
  startIndex = 0,
  showRemote = true,
  onClose,
}: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(startIndex);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // A lone `url` is just a one-entry playlist, so everything below has one shape.
  const playlist = useMemo<VideoTrack[]>(() => {
    if (tracks?.length) {
      return tracks;
    }

    return url ? [{ id: url, title: title ?? '', url }] : [];
  }, [tracks, url, title]);

  const current = playlist[index];
  const videoId = useMemo(() => (current ? getYouTubeId(current.url) : null), [current]);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => {
        if (playlist.length < 2) {
          return i;
        }

        if (shuffle) {
          let next = i;
          while (next === i) {
            next = Math.floor(Math.random() * playlist.length);
          }
          return next;
        }

        return (i + delta + playlist.length) % playlist.length;
      });
    },
    [playlist.length, shuffle],
  );

  const handleEnded = useCallback(() => {
    if (playlist.length > 1) {
      step(1);
    }
  }, [step, playlist.length]);

  const { mountRef, state, controls } = useYouTubePlayer({
    videoId,
    loop,
    onEnded: handleEnded,
  });

  const toggleFullscreen = useCallback(() => {
    const element = overlayRef.current;
    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void element.requestFullscreen?.().catch(() => {
        /* denied by the browser; the overlay is already full-screen */
      });
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Lock the page behind the overlay.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Full keyboard remote — mirrors YouTube's own shortcuts.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Don't hijack keys aimed at the remote's sliders and selects.
      if (target && /^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
        return;
      }

      const { key } = event;
      const handlers: Record<string, () => void> = {
        ' ': controls.toggle,
        k: controls.toggle,
        // In fullscreen, Escape belongs to the browser's own exit.
        Escape: () => (document.fullscreenElement ? void 0 : onClose()),
        ArrowRight: () => controls.nudge(5),
        ArrowLeft: () => controls.nudge(-5),
        l: () => controls.nudge(10),
        j: () => controls.nudge(-10),
        ArrowUp: () => controls.setVolume(state.volume + 5),
        ArrowDown: () => controls.setVolume(state.volume - 5),
        m: controls.toggleMute,
        c: controls.toggleCaptions,
        f: toggleFullscreen,
        n: () => step(1),
        p: () => step(-1),
        ',': () => controls.setRate(Math.max(0.25, state.rate - 0.25)),
        '.': () => controls.setRate(Math.min(2, state.rate + 0.25)),
        Home: () => controls.seekTo(0),
        End: () => controls.seekTo(state.duration),
      };

      const handler =
        handlers[key] ??
        (/^[0-9]$/.test(key) ? () => controls.seekFraction(Number(key) / 10) : undefined);

      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [controls, onClose, step, state.volume, state.rate, state.duration, toggleFullscreen]);

  if (!current) {
    return null;
  }

  const displayTitle = state.title || current.title;

  return (
    <Overlay ref={overlayRef} role="dialog" aria-modal="true" aria-label="Video player">
      <Caption>
        <h2>{displayTitle}</h2>
        {state.author && <p>{state.author}</p>}
      </Caption>

      <ScreenSlot>
        <TvScreen
          mountRef={mountRef}
          playing={state.playing}
          buffering={state.buffering}
          error={
            videoId
              ? state.error
              : `Couldn't read a YouTube video ID from this link: ${current.url}`
          }
          autoplayBlocked={state.autoplayBlocked}
          onUnmute={controls.toggleMute}
          onSurfaceClick={controls.toggle}
          onSurfaceDoubleClick={toggleFullscreen}
        />
      </ScreenSlot>

      <Hint>SPACE play/pause · ←→ seek · ↑↓ volume · F fullscreen · ESC close</Hint>

      {showRemote ? (
        <Remote
          state={state}
          controls={controls}
          onPower={onClose}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          loop={loop}
          onToggleLoop={() => setLoop((value) => !value)}
          shuffle={shuffle}
          onToggleShuffle={() => setShuffle((value) => !value)}
          trackIndex={index}
          trackCount={playlist.length}
          fallbackTitle={current.title}
        />
      ) : (
        <CloseButton type="button" onClick={onClose} aria-label="Close video">
          &times;
        </CloseButton>
      )}
    </Overlay>
  );
}

VideoModal.displayName = 'VideoModal';

export default VideoModal;
