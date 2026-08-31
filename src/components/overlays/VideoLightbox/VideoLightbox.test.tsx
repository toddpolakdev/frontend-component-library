import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { VideoLightbox } from './VideoLightbox';

const validUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('VideoLightbox', () => {
  it('renders an embedded player for a valid URL', () => {
    render(<VideoLightbox url={validUrl} onClose={() => {}} />);

    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/embed/dQw4w9WgXcQ'));
  });

  it('renders nothing for an unrecognized URL', () => {
    const { container } = render(<VideoLightbox url="https://example.com" onClose={() => {}} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('closes on the close button, backdrop click, and Escape key', () => {
    const onClose = vi.fn();
    render(<VideoLightbox url={validUrl} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close video' }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('does not close when the video area itself is clicked', () => {
    const onClose = vi.fn();
    render(<VideoLightbox url={validUrl} onClose={onClose} />);

    fireEvent.click(screen.getByTitle('YouTube video player'));

    expect(onClose).not.toHaveBeenCalled();
  });
});
