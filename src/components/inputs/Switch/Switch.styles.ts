import styled from 'styled-components';

export const SwitchWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

/**
 * The two radios are visually hidden but still focusable and hit-testable.
 *
 * The source used `visibility: hidden; height: 0; width: 0`, which removes the
 * control from the tab order entirely — the switch could only ever be operated
 * with a mouse. This is the clip-rect technique instead, so the input keeps its
 * native keyboard behaviour while staying invisible.
 */
export const HiddenRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  margin: -1px;
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
`;

export const OptionLabel = styled.label<{ $active: boolean; $disabled: boolean }>`
  color: ${({ $active }) => ($active ? 'var(--app-text)' : 'var(--app-muted)')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-size: 0.8125rem;
  line-height: 1.25;
  transition: color 140ms ease;
  user-select: none;

  ${HiddenRadio}:focus-visible + & {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
    border-radius: 0.125rem;
  }
`;

/**
 * The track is a `<label>` pointing at whichever option is *not* currently
 * selected, so clicking it toggles natively — no click handler, and no second
 * source of truth for the value.
 *
 * It is `aria-hidden` because the radios already carry their own visible labels;
 * without it this empty label would be concatenated into their accessible names.
 */
export const Track = styled.label<{ $disabled: boolean }>`
  position: relative;
  display: block;
  width: 42px;
  height: 20px;
  border-radius: 100px;
  background: var(--app-border-strong);
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  transition: background-color 200ms ease;
  flex: none;
`;

export const Knob = styled.span<{ $checked: boolean; $disabled: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background: var(--app-surface);
  box-shadow: 0 1px 2px rgb(0 0 0 / 25%);
  transform: translateX(${({ $checked }) => ($checked ? '22px' : '0')});
  transition:
    transform 200ms ease,
    width 200ms ease;

  /* The source's press affordance: the knob stretches while held. */
  ${Track}:active & {
    width: ${({ $disabled }) => ($disabled ? '16px' : '25px')};
  }
`;
