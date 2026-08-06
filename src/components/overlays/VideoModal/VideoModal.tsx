import { useEffect, type MouseEvent } from 'react';

import { getYouTubeId } from '../../../lib/media/getYouTubeId';
import { Backdrop, CloseButton, Iframe, VideoWrapper } from './VideoModal.styles';

export interface VideoModalProps {
  url: string;
  onClose: () => void;
}

export function VideoModal({ url, onClose }: VideoModalProps) {
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

VideoModal.displayName = 'VideoModal';

export default VideoModal;
