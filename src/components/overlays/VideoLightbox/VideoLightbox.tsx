import { useEffect, type MouseEvent } from 'react';

import { getYouTubeId } from '../../../lib/media/getYouTubeId';
import { Backdrop, CloseButton, Iframe, VideoWrapper } from './VideoLightbox.styles';

export interface VideoLightboxProps {
  url: string;
  onClose: () => void;
}

/**
 * A lightweight YouTube lightbox: a scrim, a 16:9 embed, and a close button.
 *
 * This is the library's original video overlay, kept alongside the heavier
 * VideoModal — that one loads the YouTube IFrame Player API and brings a CSS-3D
 * panel and a full remote with it, which is far more than most callers want just
 * to play a clip. Use this when a plain embed will do.
 */
export function VideoLightbox({ url, onClose }: VideoLightboxProps) {
  const videoId = getYouTubeId(url);

  // Allow closing with the Escape key.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!videoId) {
    return null;
  }

  return (
    <Backdrop role="dialog" aria-modal="true" aria-label="Video player" onClick={onClose}>
      <VideoWrapper onClick={(event: MouseEvent) => event.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close video">
          &times;
        </CloseButton>
        <Iframe
          title="YouTube video player"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </VideoWrapper>
    </Backdrop>
  );
}

VideoLightbox.displayName = 'VideoLightbox';

export default VideoLightbox;
