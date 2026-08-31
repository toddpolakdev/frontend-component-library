import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { Icon } from '../../data-display';
import {
  Controls,
  QuantityInput,
  QuantityRoot,
  StepButton,
  Warning,
} from './Quantity.styles';

/** How long the over-the-cap warning stays up, matching the source app. */
const WARNING_DURATION_MS = 2500;

/** The input accepts at most four digits, as in the source. */
const DIGITS = /^\d{0,4}$/;

export interface QuantityProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** The current quantity. This is a controlled component. */
  value: number;
  onChange: (value: number) => void;
  min?: number;
  /** Upper bound. Going past it warns instead of incrementing. */
  max?: number;
  disabled?: boolean;
  /**
   * Shown for a moment when the user tries to exceed `max` — e.g. "Only 3
   * available". Copy lives with the caller so the component stays domain-free.
   */
  maxMessage?: ReactNode;
  /** Accessible name for the number field. */
  label?: string;
  id?: string;
}

/**
 * A number stepper: minus/plus buttons around a digit-only field.
 *
 * The source version drove the cart directly — it called `useCart()`, owned a
 * debounced `updateCartItemQuantity`, and derived its ceiling from SKU
 * availability. All of that is the host app's business, so this is a plain
 * controlled input: the caller holds the value and decides what a change means.
 */
export function Quantity({
  value,
  onChange,
  min = 0,
  max,
  disabled = false,
  maxMessage,
  label = 'Quantity',
  id,
  ...rest
}: QuantityProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const warningId = `${inputId}-warning`;

  // The field holds a draft string so it can be empty mid-typing; `value` is
  // still the source of truth and wins whenever it changes.
  const [draft, setDraft] = useState(() => String(value));
  const [warning, setWarning] = useState(false);
  const warningTimer = useRef(0);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  // The source left this timer uncleared, so it fired after unmount.
  useEffect(() => () => window.clearTimeout(warningTimer.current), []);

  const flashWarning = useCallback(() => {
    setWarning(true);
    window.clearTimeout(warningTimer.current);
    warningTimer.current = window.setTimeout(() => setWarning(false), WARNING_DURATION_MS);
  }, []);

  const commit = useCallback(
    (next: number) => {
      const capped = max === undefined ? next : Math.min(next, max);
      const clamped = Math.max(min, capped);

      if (max !== undefined && next > max) {
        flashWarning();
      } else {
        window.clearTimeout(warningTimer.current);
        setWarning(false);
      }

      setDraft(String(clamped));

      if (clamped !== value) {
        onChange(clamped);
      }
    },
    [flashWarning, max, min, onChange, value],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (DIGITS.test(next)) {
      setDraft(next);
    }
  };

  const commitDraft = () => {
    commit(draft === '' ? min : Number.parseInt(draft, 10));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitDraft();
    }
  };

  const atMax = max !== undefined && value >= max;

  return (
    <QuantityRoot {...rest}>
      <Controls $warning={warning}>
        <StepButton
          type="button"
          aria-label="Decrease quantity"
          onClick={() => commit(value - 1)}
          disabled={disabled || value <= min}
        >
          <Icon variant="Minus" size={16} />
        </StepButton>

        <QuantityInput
          type="text"
          inputMode="numeric"
          id={inputId}
          aria-label={label}
          aria-describedby={warning && maxMessage ? warningId : undefined}
          value={draft}
          onChange={handleChange}
          onBlur={commitDraft}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {/* Deliberately still enabled at the cap: clicking it explains why it
            won't go higher, which a disabled button can't do. */}
        <StepButton
          type="button"
          aria-label="Increase quantity"
          onClick={() => (atMax ? flashWarning() : commit(value + 1))}
          disabled={disabled}
        >
          <Icon variant="Plus" size={16} />
        </StepButton>
      </Controls>

      {warning && maxMessage ? (
        <Warning id={warningId} role="status">
          {maxMessage}
        </Warning>
      ) : null}
    </QuantityRoot>
  );
}

Quantity.displayName = 'Quantity';

export default Quantity;
