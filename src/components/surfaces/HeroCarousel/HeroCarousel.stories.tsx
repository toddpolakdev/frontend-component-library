import type { Meta, StoryObj } from '@storybook/react';

import { HeroCarousel, type HeroSlide } from './HeroCarousel';

/** Inline SVG slides, so the stories don't depend on a CDN. */
const banner = (label: string, from: string, to: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
      </linearGradient></defs>
      <rect width="1600" height="800" fill="url(#g)"/>
      <text x="1500" y="760" font-family="Georgia,serif" font-size="42" fill="rgba(0,0,0,0.25)" text-anchor="end">${label}</text>
    </svg>`,
  )}`;

const SLIDES: HeroSlide[] = [
  {
    id: 'knitwear',
    image: banner('01', '#e9e4dc', '#cfc7b8'),
    title: 'The knitwear edit',
    href: '#knitwear',
    ctaLabel: 'Shop knitwear',
  },
  {
    id: 'shirting',
    image: banner('02', '#d3dae6', '#aab6cc'),
    title: 'New season shirting',
    href: '#shirting',
    ctaLabel: 'Shop shirting',
  },
  {
    id: 'outerwear',
    image: banner('03', '#dde3d5', '#b6c3a6'),
    title: 'Outerwear, restocked',
    href: '#outerwear',
    ctaLabel: 'Shop outerwear',
  },
];

const meta: Meta<typeof HeroCarousel> = {
  title: 'Components/HeroCarousel',
  component: HeroCarousel,
  args: {
    slides: SLIDES,
    label: 'Featured collections',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HeroCarousel>;

export const Default: Story = {};

/**
 * Autoplay is opt-in. It pauses while the pointer is over the carousel or
 * something inside it has focus, and it doesn't run at all for anyone who
 * prefers reduced motion.
 */
export const AutoPlaying: Story = {
  args: { autoPlayInterval: 3000 },
};

/** With one slide the arrows and dots disappear — there's nowhere to go. */
export const SingleSlide: Story = {
  args: { slides: [SLIDES[0]] },
};

/** Images alone, with no caption or call to action. */
export const ImagesOnly: Story = {
  args: {
    slides: SLIDES.map(({ id, image }) => ({ id, image, alt: `Campaign image ${id}` })),
  },
};

/** Opening part-way through the set. */
export const StartsOnThird: Story = {
  args: { startIndex: 2 },
};
