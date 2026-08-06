import { useEffect, useRef, type Ref } from 'react';

import { VolumeMuteIcon } from './icons';
import {
  Bloom,
  Chassis,
  Chin,
  ClickLayer,
  ErrorNote,
  Glass,
  Grid,
  Led,
  Mount,
  Panel,
  Sheen,
  Spinner,
  Stage,
  Stand,
  Status,
  UnmuteNote,
} from './TvScreen.styles';

/**
 * A thin-bezel flat panel rendered with real CSS 3D transforms.
 *
 * Everything here is native `perspective` + `preserve-3d`: the panel, its edge
 * slab and the stand are genuinely positioned in Z, so the parallax is
 * perspective-correct rather than a 2D fake. This is also the only technique
 * that works — a cross-origin YouTube iframe can never be a WebGL texture.
 */
export interface TvScreenProps {
  /** The YT player mounts into this node. */
  mountRef: Ref<HTMLDivElement>;
  playing: boolean;
  buffering: boolean;
  error: string | null;
  /** Browser refused unmuted autoplay; we're playing silently. */
  autoplayBlocked: boolean;
  onUnmute: () => void;
  /** Click anywhere on the glass. */
  onSurfaceClick: () => void;
  onSurfaceDoubleClick?: () => void;
}

export function TvScreen({
  mountRef,
  playing,
  buffering,
  error,
  autoplayBlocked,
  onUnmute,
  onSurfaceClick,
  onSurfaceDoubleClick,
}: TvScreenProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Pointer parallax. Written straight to CSS custom properties inside a rAF
  // so we never re-render React on mouse move.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let frame = 0;
    const handleMove = (event: PointerEvent) => {
      if (frame) {
        return;
      }

      frame = requestAnimationFrame(() => {
        frame = 0;
        const x = event.clientX / window.innerWidth - 0.5; // -0.5..0.5
        const y = event.clientY / window.innerHeight - 0.5;
        panel.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
        panel.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
      });
    };

    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <Stage>
      <Bloom $on={playing} />
      <Panel ref={panelRef}>
        <Chassis>
          <Glass>
            <Mount ref={mountRef} />
            <ClickLayer
              type="button"
              onClick={onSurfaceClick}
              onDoubleClick={onSurfaceDoubleClick}
              aria-label={playing ? 'Pause' : 'Play'}
            />
            <Sheen />
            <Grid />
            {(buffering || error) && (
              <Status>{error ? <ErrorNote>{error}</ErrorNote> : <Spinner />}</Status>
            )}
            {autoplayBlocked && !error && (
              <UnmuteNote type="button" onClick={onUnmute}>
                <VolumeMuteIcon /> Muted by your browser — click for sound
              </UnmuteNote>
            )}
          </Glass>
          <Chin>
            <Led $on={playing} />
          </Chin>
        </Chassis>
        <Stand />
      </Panel>
    </Stage>
  );
}

TvScreen.displayName = 'TvScreen';

export default TvScreen;
