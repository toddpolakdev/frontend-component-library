import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ThumbnailPicker, type ThumbnailOption } from './ThumbnailPicker';

/** Inline SVG data URIs so the stories don't depend on the network. */
const swatch = (label: string, background: string, color = '#333') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70"><rect width="70" height="70" fill="${background}"/><text x="35" y="42" font-family="Georgia,serif" font-size="26" fill="${color}" text-anchor="middle">${label}</text></svg>`,
  )}`;

const STYLES: ThumbnailOption[] = [
  { value: 'one-character', image: swatch('A', '#f3f3f3'), label: 'One Character' },
  { value: 'name', image: swatch('Amy', '#eef2ff'), label: 'Name' },
  { value: 'monogram', image: swatch('AMB', '#fef3c7'), label: 'Monogram' },
  { value: 'whimsy', image: swatch('a', '#fce7f3'), label: 'Whimsy' },
];

const FONTS: ThumbnailOption[] = [
  { value: 'frame-it', image: swatch('F', '#f3f3f3'), label: 'Frame It' },
  { value: 'circle-serif', image: swatch('C', '#f3f3f3'), label: 'Circle Serif' },
  { value: 'well-rounded', image: swatch('W', '#f3f3f3'), label: 'Well Rounded' },
  { value: 'block-large', image: swatch('B', '#f3f3f3'), label: 'Block Large' },
  { value: 'miller-daily', image: swatch('M', '#f3f3f3'), label: 'Miller Daily' },
  { value: 'proxima-nova', image: swatch('P', '#f3f3f3'), label: 'Proxima Nova' },
  { value: 'athletic-swoosh', image: swatch('A', '#f3f3f3'), label: 'Athletic Swoosh' },
  { value: 'campus', image: swatch('C', '#f3f3f3'), label: 'Campus' },
];

const meta: Meta<typeof ThumbnailPicker> = {
  title: 'Components/ThumbnailPicker',
  component: ThumbnailPicker,
  args: {
    options: STYLES,
    heading: 'Step 1: Choose your monogram style.',
    showLabels: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ThumbnailPicker>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ maxWidth: '30rem' }}>
        <ThumbnailPicker {...args} value={value} onChange={setValue} />
        <p style={{ fontSize: '0.875rem', color: 'var(--app-muted)' }}>
          Selected: <code>{value ?? 'nothing yet'}</code>
        </p>
      </div>
    );
  },
};

/** Without captions the tile is image-only — hover or focus it for the label. */
export const ImagesOnly: Story = {
  args: {
    options: FONTS,
    heading: 'Step 2: Choose your font.',
    showLabels: false,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>('frame-it');
    return (
      <div style={{ maxWidth: '30rem' }}>
        <ThumbnailPicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

/** Uncontrolled, with a starting choice. */
export const WithDefault: Story = {
  args: {
    defaultValue: 'monogram',
  },
  render: (args) => (
    <div style={{ maxWidth: '30rem' }}>
      <ThumbnailPicker {...args} />
    </div>
  ),
};

/** Larger tiles. */
export const LargeTiles: Story = {
  args: {
    size: 110,
    defaultValue: 'name',
  },
  render: (args) => (
    <div style={{ maxWidth: '32rem' }}>
      <ThumbnailPicker {...args} />
    </div>
  ),
};

/** Individual options can be unavailable. */
export const PartlyUnavailable: Story = {
  args: {
    options: [
      STYLES[0],
      STYLES[1],
      { ...STYLES[2], disabled: true },
      { ...STYLES[3], disabled: true },
    ],
    defaultValue: 'name',
  },
  render: (args) => (
    <div style={{ maxWidth: '30rem' }}>
      <ThumbnailPicker {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'name',
  },
  render: (args) => (
    <div style={{ maxWidth: '30rem' }}>
      <ThumbnailPicker {...args} />
    </div>
  ),
};

/** Two steps in sequence, the way the source app used it. */
export const MultiStep: Story = {
  render: () => {
    const [style, setStyle] = useState<string | null>('monogram');
    const [font, setFont] = useState<string | null>(null);

    return (
      <div style={{ maxWidth: '30rem' }}>
        <ThumbnailPicker
          options={STYLES}
          heading="Step 1: Choose your monogram style."
          showLabels
          value={style}
          onChange={setStyle}
        />
        <ThumbnailPicker
          options={FONTS}
          heading="Step 2: Choose your font."
          value={font}
          onChange={setFont}
        />
      </div>
    );
  },
};
