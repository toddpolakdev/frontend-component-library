import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

import { formatTime, qualityLabel } from '../../../lib/media/youtubeApi';
import {
  BackwardIcon,
  CaptionsIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CompressIcon,
  ExpandIcon,
  ForwardIcon,
  GripIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  PowerIcon,
  ShuffleIcon,
  StepBackwardIcon,
  StepForwardIcon,
  StopIcon,
  VolumeMuteIcon,
  VolumeUpIcon,
} from './icons';
import {
  Badge,
  Collapse,
  DKey,
  Dpad,
  Handle,
  Ir,
  Key,
  Keypad,
  Label,
  Lcd,
  LcdRow,
  LcdSlot,
  LcdTitle,
  NumKey,
  Ok,
  PowerKey,
  Row,
  Section,
  Select,
  Shell,
  Slider,
  VolumeSlot,
} from './Remote.styles';
import type { PlayerControls, PlayerSnapshot } from './useYouTubePlayer';

export interface RemoteProps {
  state: PlayerSnapshot;
  controls: PlayerControls;
  onPower: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  loop: boolean;
  onToggleLoop: () => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  trackIndex: number;
  trackCount: number;
  fallbackTitle: string;
}

const SEEK_STEP = 10;
const VOLUME_STEP = 10;

const KEYPAD_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/**
 * A draggable hardware-style remote: the only control surface for the player.
 *
 * YouTube's own chrome is suppressed (`controls=0`, the iframe takes no pointer
 * events), so every transport command comes from here or from the keyboard
 * handler in VideoModal.
 */
export function Remote({
  state,
  controls,
  onPower,
  onPrev,
  onNext,
  onToggleFullscreen,
  isFullscreen,
  loop,
  onToggleLoop,
  shuffle,
  onToggleShuffle,
  trackIndex,
  trackCount,
  fallbackTitle,
}: RemoteProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [flash, setFlash] = useState(false);
  const [scrub, setScrub] = useState<number | null>(null);

  // Pulse the IR emitter on every command, like a real remote.
  const flashTimer = useRef<number>(0);
  const ping = useCallback(() => {
    setFlash(false);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(true), 16);
  }, []);

  useEffect(() => {
    if (!flash) {
      return;
    }

    const id = window.setTimeout(() => setFlash(false), 340);
    return () => window.clearTimeout(id);
  }, [flash]);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  /** Wraps any handler so the IR LED fires alongside the command. */
  const cmd = useCallback(
    (fn: () => void) => () => {
      ping();
      fn();
    },
    [ping],
  );

  // Default placement: bottom-right, clear of the screen.
  useEffect(() => {
    if (position) {
      return;
    }

    const element = shellRef.current;
    const width = element?.offsetWidth ?? 268;
    const height = element?.offsetHeight ?? 560;
    setPosition({
      x: Math.max(12, window.innerWidth - width - 28),
      y: Math.max(12, window.innerHeight - height - 24),
    });
  }, [position]);

  // Drag by the handle; clamped so the remote can't be lost off-screen.
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  const onHandleDown = (event: PointerEvent) => {
    const element = shellRef.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    dragOffset.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };

  const onHandleMove = (event: PointerEvent) => {
    const offset = dragOffset.current;
    const element = shellRef.current;
    if (!offset || !element) {
      return;
    }

    const maxX = window.innerWidth - element.offsetWidth - 8;
    const maxY = window.innerHeight - element.offsetHeight - 8;
    setPosition({
      x: Math.min(Math.max(8, event.clientX - offset.dx), Math.max(8, maxX)),
      y: Math.min(Math.max(8, event.clientY - offset.dy), Math.max(8, maxY)),
    });
  };

  const endDrag = (event: PointerEvent) => {
    dragOffset.current = null;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
  };

  // Keep the remote on-screen when the window resizes.
  useEffect(() => {
    const onResize = () => {
      const element = shellRef.current;
      if (!element) {
        return;
      }

      setPosition((previous) =>
        previous
          ? {
              x: Math.min(previous.x, Math.max(8, window.innerWidth - element.offsetWidth - 8)),
              y: Math.min(previous.y, Math.max(8, window.innerHeight - element.offsetHeight - 8)),
            }
          : previous,
      );
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { duration, currentTime, volume, muted, rate, rates, quality, qualities } = state;

  const displayTime = scrub ?? currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;
  const title = state.title || fallbackTitle || '—';

  const commitScrub = () => {
    if (scrub !== null) {
      ping();
      controls.seekTo(scrub);
    }

    setScrub(null);
  };

  return (
    <Shell
      ref={shellRef}
      $collapsed={collapsed}
      style={position ? { left: position.x, top: position.y } : { visibility: 'hidden' }}
      role="group"
      aria-label="Player remote"
    >
      <Handle
        onPointerDown={onHandleDown}
        onPointerMove={onHandleMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <Ir $flash={flash} aria-hidden />
        <GripIcon />
        <Collapse
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expand remote' : 'Collapse remote'}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </Collapse>
      </Handle>

      <Lcd>
        <LcdRow>
          <span>
            {state.playing ? '▶' : state.buffering ? '⋯' : '❚❚'} {formatTime(displayTime)}
          </span>
          <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </LcdRow>
        {!collapsed && (
          <>
            <LcdTitle title={title}>{title}</LcdTitle>
            <LcdRow>
              <Badge>
                CH {String(trackIndex + 1).padStart(2, '0')}/{String(trackCount).padStart(2, '0')}
              </Badge>
              <Badge>
                {rate}× · {qualityLabel(quality)} · {muted ? 'MUTE' : `VOL ${volume}`}
              </Badge>
            </LcdRow>
          </>
        )}
        <LcdSlot>
          <Slider
            min={0}
            max={Math.max(1, Math.floor(duration))}
            step={1}
            value={Math.floor(displayTime)}
            $fill={progress}
            aria-label="Seek"
            onChange={(event) => setScrub(Number(event.target.value))}
            onPointerUp={commitScrub}
            onKeyUp={commitScrub}
          />
        </LcdSlot>
      </Lcd>

      <Row>
        <PowerKey type="button" onClick={cmd(onPower)} aria-label="Power off / close player">
          <PowerIcon />
        </PowerKey>
        <Key
          type="button"
          onClick={cmd(onToggleFullscreen)}
          $active={isFullscreen}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <CompressIcon /> : <ExpandIcon />}
        </Key>
        <Key
          type="button"
          onClick={cmd(controls.toggleCaptions)}
          $active={state.captions}
          aria-label="Toggle captions"
        >
          <CaptionsIcon />
        </Key>
      </Row>

      {!collapsed && (
        <>
          <Dpad>
            <div />
            <DKey
              type="button"
              onClick={cmd(() => controls.setVolume(volume + VOLUME_STEP))}
              aria-label="Volume up"
            >
              <ChevronUpIcon />
            </DKey>
            <div />
            <DKey
              type="button"
              onClick={cmd(() => controls.nudge(-SEEK_STEP))}
              aria-label={`Rewind ${SEEK_STEP} seconds`}
            >
              <ChevronLeftIcon />
            </DKey>
            <Ok type="button" onClick={cmd(controls.toggle)} aria-label="Play or pause">
              {state.playing ? <PauseIcon /> : <PlayIcon />}
            </Ok>
            <DKey
              type="button"
              onClick={cmd(() => controls.nudge(SEEK_STEP))}
              aria-label={`Forward ${SEEK_STEP} seconds`}
            >
              <ChevronRightIcon />
            </DKey>
            <div />
            <DKey
              type="button"
              onClick={cmd(() => controls.setVolume(volume - VOLUME_STEP))}
              aria-label="Volume down"
            >
              <ChevronDownIcon />
            </DKey>
            <div />
          </Dpad>

          <Section>
            <Row>
              <Key
                type="button"
                onClick={cmd(onPrev)}
                disabled={trackCount < 2}
                aria-label="Previous video"
              >
                <StepBackwardIcon />
              </Key>
              <Key type="button" onClick={cmd(controls.stop)} aria-label="Stop">
                <StopIcon />
              </Key>
              <Key
                type="button"
                onClick={cmd(onNext)}
                disabled={trackCount < 2}
                aria-label="Next video"
              >
                <StepForwardIcon />
              </Key>
            </Row>
            <Row>
              <Key
                type="button"
                onClick={cmd(() => controls.nudge(-30))}
                aria-label="Rewind 30 seconds"
              >
                <BackwardIcon /> 30
              </Key>
              <Key
                type="button"
                onClick={cmd(() => controls.nudge(30))}
                aria-label="Forward 30 seconds"
              >
                30 <ForwardIcon />
              </Key>
            </Row>
            <Row>
              <Key type="button" onClick={cmd(controls.toggleMute)} $active={muted} aria-label="Mute">
                {muted ? <VolumeMuteIcon /> : <VolumeUpIcon />}
              </Key>
              <VolumeSlot>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={muted ? 0 : volume}
                  $fill={muted ? 0 : volume}
                  aria-label="Volume"
                  onChange={(event) => controls.setVolume(Number(event.target.value))}
                />
              </VolumeSlot>
            </Row>
            <Row>
              <Key type="button" onClick={cmd(onToggleLoop)} $active={loop} aria-label="Loop">
                <LoopIcon />
              </Key>
              <Key
                type="button"
                onClick={cmd(onToggleShuffle)}
                $active={shuffle}
                disabled={trackCount < 2}
                aria-label="Shuffle"
              >
                <ShuffleIcon />
              </Key>
            </Row>
            <Row>
              <Select
                value={String(rate)}
                aria-label="Playback speed"
                onChange={(event) => {
                  ping();
                  controls.setRate(Number(event.target.value));
                }}
              >
                {rates.map((option) => (
                  <option key={option} value={option}>
                    {option}× speed
                  </option>
                ))}
              </Select>
              <Select
                value={quality}
                aria-label="Video quality"
                onChange={(event) => {
                  ping();
                  controls.setQuality(event.target.value);
                }}
              >
                {(qualities.length ? qualities : [quality]).map((option) => (
                  <option key={option} value={option}>
                    {qualityLabel(option)}
                  </option>
                ))}
              </Select>
            </Row>
          </Section>

          <Label>Jump to</Label>
          <Keypad>
            {KEYPAD_DIGITS.map((digit) => (
              <NumKey
                key={digit}
                type="button"
                onClick={cmd(() => controls.seekFraction(digit === 0 ? 0 : digit / 10))}
                aria-label={`Jump to ${digit === 0 ? 0 : digit * 10} percent`}
                style={digit === 0 ? { gridColumn: 2 } : undefined}
              >
                {digit}
              </NumKey>
            ))}
          </Keypad>
        </>
      )}
    </Shell>
  );
}

Remote.displayName = 'Remote';

export default Remote;
