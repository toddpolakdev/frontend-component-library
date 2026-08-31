import type { SVGProps } from 'react';

import { Svg } from './Icon.styles';
import { GLYPHS, type IconVariant } from './variants';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'children'> {
  /** Which glyph to draw. */
  variant: IconVariant;
  /**
   * Rendered size in px (or any CSS length). Square for every glyph except the
   * Vercel wordmark, which keeps its own aspect ratio.
   */
  size?: number | string;
  /**
   * Accessible name. Provide it when the icon carries meaning on its own; leave
   * it off when the icon sits next to a text label, and it stays `aria-hidden`
   * so screen readers don't announce it twice.
   */
  label?: string;
}

/**
 * The icon set: one `<svg>` shell, `size`/`label` props, and `currentColor`
 * throughout so icons take the colour of whatever they sit inside.
 */
export function Icon({ variant, size = 24, label, ...rest }: IconProps) {
  const glyph = GLYPHS[variant];

  // Only non-square marks carry a ratio, and only a numeric size can scale it.
  const width =
    'ratio' in glyph && typeof size === 'number' ? Math.round(size * glyph.ratio) : size;

  const paint =
    glyph.paint === 'fill'
      ? { fill: 'currentColor', stroke: 'none' }
      : {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 'strokeWidth' in glyph ? glyph.strokeWidth : 1.5,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        };

  return (
    <Svg
      viewBox={glyph.viewBox}
      width={width}
      height={size}
      data-variant={variant}
      {...paint}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...rest}
    >
      {glyph.content}
    </Svg>
  );
}

Icon.displayName = 'Icon';

export default Icon;
