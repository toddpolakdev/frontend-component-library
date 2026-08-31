import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';

import {
  Caption,
  Fieldset,
  Grid,
  Legend,
  RadioInput,
  Thumb,
  Tile,
  Tooltip,
} from './ThumbnailPicker.styles';

export interface ThumbnailOption {
  /** Reported through `onChange`, and the React key. */
  value: string;
  /** Thumbnail image URL. */
  image: string;
  /** Human-readable name — the option's accessible name, caption and tooltip. */
  label: string;
  disabled?: boolean;
}

export interface ThumbnailPickerProps
  extends Omit<
    HTMLAttributes<HTMLFieldSetElement>,
    // `value`/`defaultValue` on HTMLAttributes are the form-control kind and
    // can't be null; ours are the selected option, which starts as null.
    'onChange' | 'children' | 'value' | 'defaultValue'
  > {
  options: ThumbnailOption[];
  /** Selected value. Supply it to control the picker yourself. */
  value?: string | null;
  /** Starting selection when the picker manages its own state. */
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  /** Label for the whole group, rendered as the fieldset's legend. */
  heading?: ReactNode;
  /** Show each label as a caption inside its tile. */
  showLabels?: boolean;
  /** Tile edge length in px. */
  size?: number;
  disabled?: boolean;
  /** Radio group name. Generated when omitted. */
  name?: string;
}

/**
 * Pick one option from a grid of thumbnails.
 *
 * Ported from the source's `TabList`, which was neither a tab list nor usable:
 * it held the selection in its own `useState` with no `value`/`onChange`, so the
 * host app could never read what was chosen. It's a controlled — or optionally
 * uncontrolled — radio group now, built on real `<input type="radio">` elements
 * so Tab and arrow-key navigation come from the browser rather than from code.
 */
export function ThumbnailPicker({
  options,
  value: valueProp,
  defaultValue = null,
  onChange,
  heading,
  showLabels = false,
  size = 70,
  disabled = false,
  name,
  ...rest
}: ThumbnailPickerProps) {
  const generatedId = useId();
  const headingId = `${generatedId}-heading`;
  const groupName = name ?? `${generatedId}-group`;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const selected = isControlled ? valueProp : uncontrolledValue;

  const select = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  return (
    <Fieldset {...rest} disabled={disabled}>
      {heading ? <Legend id={headingId}>{heading}</Legend> : null}

      <Grid>
        {options.map((option) => {
          const isSelected = option.value === selected;
          const isDisabled = disabled || Boolean(option.disabled);

          return (
            <Tile
              key={option.value}
              $size={size}
              $selected={isSelected}
              $disabled={isDisabled}
              data-value={option.value}
              data-selected={isSelected || undefined}
            >
              <RadioInput
                type="radio"
                name={groupName}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                aria-label={option.label}
                // Browsers don't dispatch events from disabled controls, but
                // enforce it here too so "disabled emits nothing" is the
                // component's guarantee rather than the environment's.
                onChange={() => !isDisabled && select(option.value)}
              />

              {/* Decorative: the radio already carries the option's name. */}
              <Thumb src={option.image} alt="" loading="lazy" />

              {showLabels ? <Caption>{option.label}</Caption> : null}

              {/* Visual reinforcement only, so it isn't announced twice. */}
              <Tooltip aria-hidden="true">{option.label}</Tooltip>
            </Tile>
          );
        })}
      </Grid>
    </Fieldset>
  );
}

ThumbnailPicker.displayName = 'ThumbnailPicker';

export default ThumbnailPicker;
