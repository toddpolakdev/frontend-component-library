import type { ReactNode } from 'react';

import { BadgeRoot, type BadgeVariant } from './Badge.styles';

export type { BadgeVariant } from './Badge.styles';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = 'client' }: BadgeProps) {
  return (
    <BadgeRoot $variant={variant} data-variant={variant}>
      {children}
    </BadgeRoot>
  );
}

Badge.displayName = 'Badge';

export default Badge;
