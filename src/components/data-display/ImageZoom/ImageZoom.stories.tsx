import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ImageZoom } from './ImageZoom';

/** A detailed inline SVG, so the zoom has something to actually magnify. */
const swatch = (label: string, background: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
      <rect width="900" height="900" fill="${background}"/>
      ${Array.from({ length: 30 }, (_, row) =>
        Array.from(
          { length: 30 },
          (__, col) =>
            `<circle cx="${col * 30 + 15}" cy="${row * 30 + 15}" r="4" fill="rgba(0,0,0,0.18)"/>`,
        ).join(''),
      ).join('')}
      <text x="450" y="470" font-family="Georgia,serif" font-size="64" fill="#1f2937" text-anchor="middle">${label}</text>
      <text x="450" y="530" font-family="Georgia,serif" font-size="18" fill="#6b7280" text-anchor="middle">zoom in to read this line</text>
    </svg>`,
  )}`;

const meta: Meta<typeof ImageZoom> = {
  title: 'Components/ImageZoom',
  component: ImageZoom,
  args: {
    src: swatch('Merino', '#e9e4dc'),
    alt: 'Merino crew neck',
    size: 420,
    zoom: 220,
  },
  argTypes: {
    size: { control: { type: 'range', min: 200, max: 700, step: 20 } },
    zoom: { control: { type: 'range', min: 120, max: 400, step: 10 } },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ImageZoom>;

/** Click to zoom, then move the pointer to pan. Tab to it and press Enter, then use the arrow keys. */
export const Default: Story = {};

/** Heavier magnification. */
export const DeepZoom: Story = {
  args: { zoom: 350 },
};

/**
 * In a gallery: only the shown image stays zoomable, and switching thumbnails
 * resets the one you left — that's what `active` is for.
 */
export const InAGallery: Story = {
  render: (args) => {
    const images = [
      { id: 'a', src: swatch('Oatmeal', '#e9e4dc'), alt: 'Oatmeal crew neck' },
      { id: 'b', src: swatch('Navy', '#d3dae6'), alt: 'Navy crew neck' },
      { id: 'c', src: swatch('Moss', '#dde3d5'), alt: 'Moss crew neck' },
    ];
    const [current, setCurrent] = useState('a');

    return (
      <div style={{ display: 'grid', gap: '0.75rem', width: 'fit-content' }}>
        {images.map((image) => (
          <div key={image.id} style={{ display: current === image.id ? 'block' : 'none' }}>
            <ImageZoom {...args} src={image.src} alt={image.alt} active={current === image.id} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setCurrent(image.id)}
              aria-pressed={current === image.id}
              style={{
                width: 64,
                height: 64,
                padding: 0,
                cursor: 'pointer',
                borderRadius: 8,
                border: `1px solid ${
                  current === image.id ? 'var(--app-primary)' : 'var(--app-border)'
                }`,
                background: `center / cover no-repeat url("${image.src}")`,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clipPath: 'inset(50%)',
                }}
              >
                {image.alt}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  },
};
