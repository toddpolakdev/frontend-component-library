import { useId } from 'react';

import { HiddenRadio, Knob, OptionLabel, SwitchWrapper, Track } from './Switch.styles';

export interface SwitchOption<T> {
  label: string;
  value: T;
}

export interface SwitchProps<T> {
  /** The option shown on the left, selected when the knob sits left. */
  firstOption: SwitchOption<T>;
  /** The option shown on the right, selected when the knob sits right. */
  secondOption: SwitchOption<T>;
  /** The currently selected value. Matched against each option's `value`. */
  value: T;
  onChange: (value: T) => void;
  /** Names the group for screen readers, e.g. "Units". */
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A two-value segmented toggle: a label on each side of a sliding track.
 *
 * Despite the name this is not an on/off switch — it picks between two named
 * values — so it is built as a native radio group rather than the source's
 * checkbox. That buys the whole keyboard story for free: one tab stop for the
 * pair, arrow keys to move between values, and `<label htmlFor>` doing the
 * click-to-select natively.
 *
 * Three source bugs are fixed here:
 *
 * 1. The checkbox was hardcoded to `id="react-switch-new"`, so a second Switch
 *    on the page shared the first one's id and its label toggled the wrong
 *    control. Ids and the radio group `name` now come from `useId()`.
 * 2. The input was `visibility: hidden` with `onChange={() => {}}` — all state
 *    changes came from `onClick` on the labels, making the control completely
 *    unreachable by keyboard. The radios are hidden with a clip rect and drive
 *    the change themselves.
 * 3. Nothing exposed the selection to assistive tech. The wrapper is a
 *    `radiogroup` and each value is announced with its own label.
 *
 * `value` is compared with `Object.is`, so it works for strings, numbers,
 * booleans, or a shared object reference. A value matching neither option
 * leaves both radios unselected, which is a legitimate "nothing chosen yet"
 * state rather than a silent snap to the first option.
 */
export function Switch<T>({
  firstOption,
  secondOption,
  value,
  onChange,
  label,
  disabled = false,
  className,
}: SwitchProps<T>) {
  const groupId = useId();
  const firstId = `${groupId}-first`;
  const secondId = `${groupId}-second`;

  const firstSelected = Object.is(value, firstOption.value);
  const secondSelected = Object.is(value, secondOption.value);

  return (
    <SwitchWrapper
      className={className}
      role="radiogroup"
      aria-label={label}
      data-disabled={disabled || undefined}
    >
      <HiddenRadio
        type="radio"
        id={firstId}
        name={groupId}
        checked={firstSelected}
        disabled={disabled}
        onChange={() => onChange(firstOption.value)}
      />
      <OptionLabel htmlFor={firstId} $active={firstSelected} $disabled={disabled}>
        {firstOption.label}
      </OptionLabel>

      {/*
        Points at whichever option is not selected, so a click on the track
        toggles. When neither is selected it targets the second — the knob is
        parked left, so that is where a click visually sends it.
      */}
      <Track
        htmlFor={secondSelected ? firstId : secondId}
        aria-hidden="true"
        $disabled={disabled}
        data-checked={secondSelected || undefined}
      >
        <Knob $checked={secondSelected} $disabled={disabled} />
      </Track>

      <HiddenRadio
        type="radio"
        id={secondId}
        name={groupId}
        checked={secondSelected}
        disabled={disabled}
        onChange={() => onChange(secondOption.value)}
      />
      <OptionLabel htmlFor={secondId} $active={secondSelected} $disabled={disabled}>
        {secondOption.label}
      </OptionLabel>
    </SwitchWrapper>
  );
}

Switch.displayName = 'Switch';

export default Switch;
