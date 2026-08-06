import { AvatarRoot } from './Avatar.styles';

export interface AvatarProps {
  name: string;
  color?: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, color = 'var(--app-primary)' }: AvatarProps) {
  return (
    <AvatarRoot $color={color} aria-label={`${name} avatar`}>
      {getInitials(name)}
    </AvatarRoot>
  );
}

Avatar.displayName = 'Avatar';

export default Avatar;
