import type { HTMLAttributes } from 'react';

import { Icon } from '../Icon';
import { RatingRoot, Star } from './Rating.styles';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The score. Fractions round down, so 4.9 shows four filled stars. */
  value: number;
  /** How many stars to draw. */
  max?: number;
  /** Star size in px. */
  size?: number;
  /**
   * Accessible name. Defaults to "Rated 4.5 out of 5" — note it announces the
   * exact value, not the rounded-down number of filled stars.
   */
  label?: string;
}

/**
 * A read-only star rating.
 *
 * The source rendered five bare stars with no accessible name, and since icons
 * are decorative by default that left assistive tech with nothing to announce at
 * all. The row now carries a single `role="img"` with the score in its label.
 */
export function Rating({ value, max = 5, size = 20, label, ...rest }: RatingProps) {
  const total = Math.max(0, Math.floor(max));
  // Ratings usually arrive from an API, so don't trust the number blindly.
  const score = Number.isFinite(value) ? Math.min(Math.max(value, 0), total) : 0;
  const filled = Math.floor(score);

  return (
    <RatingRoot
      {...rest}
      role="img"
      aria-label={label ?? `Rated ${score} out of ${total}`}
      data-value={score}
    >
      {Array.from({ length: total }, (_, index) => (
        <Star key={index} $filled={index < filled} data-filled={index < filled || undefined}>
          <Icon variant="Star" size={size} />
        </Star>
      ))}
    </RatingRoot>
  );
}

Rating.displayName = 'Rating';

export default Rating;
