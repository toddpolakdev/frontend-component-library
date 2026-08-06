import type { ReactNode } from 'react';

import { Card, Description, IconBadge, Title, Value, type StatCardVariant } from './StatCard.styles';

export type { StatCardVariant } from './StatCard.styles';

export interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  variant?: StatCardVariant;
}

export function StatCard({ title, value, description, icon, variant = 'blue' }: StatCardProps) {
  return (
    <Card $variant={variant} data-variant={variant}>
      <IconBadge aria-hidden="true">{icon}</IconBadge>

      <div>
        <Title>{title}</Title>
        <Value>{value}</Value>
        <Description>{description}</Description>
      </div>
    </Card>
  );
}

StatCard.displayName = 'StatCard';

export default StatCard;
