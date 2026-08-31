import type { ButtonHTMLAttributes } from 'react';

import { Icon, type IconVariant } from '../../data-display';
import { Description, IconSlot, Tile, Title } from './OptionTile.styles';

export interface OptionTileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title'> {
  title: string;
  description?: string;
  iconVariant?: IconVariant;
  /** Whether this tile is the chosen one. */
  selected?: boolean;
  disabled?: boolean;
}

/**
 * A selectable card: icon, title, supporting line.
 *
 * The source's `active` prop defaulted to `true` and only controlled whether the
 * border was drawn, so a freshly rendered row of tiles all looked chosen. It's
 * `selected` here, defaulting to `false`, and both states keep a border — the
 * selected one just takes the accent colour.
 *
 * Rendered as a toggle button (`aria-pressed`) since a lone tile has no group to
 * belong to. For a mutually exclusive set of image choices, ThumbnailPicker is
 * the better fit — it gives you real radio semantics and arrow-key navigation.
 */
export function OptionTile({
  title,
  description,
  iconVariant = 'Info',
  selected = false,
  disabled = false,
  ...rest
}: OptionTileProps) {
  return (
    <Tile
      {...rest}
      type="button"
      $selected={selected}
      aria-pressed={selected}
      data-selected={selected || undefined}
      disabled={disabled}
    >
      <IconSlot>
        <Icon variant={iconVariant} size={20} />
      </IconSlot>

      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
    </Tile>
  );
}

OptionTile.displayName = 'OptionTile';

export default OptionTile;
