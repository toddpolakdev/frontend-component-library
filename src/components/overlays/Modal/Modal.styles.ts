import styled from 'styled-components';

/**
 * The scrim. The source rendered `<div className={s.overlay}>` but never defined
 * `.overlay` in its CSS module, so the class resolved to `undefined` and the
 * modal floated over the page with no dimming at all.
 */
export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 1.5rem;
  background: rgb(15 23 42 / 60%);
  backdrop-filter: blur(4px);
`;

export const Dialog = styled.div<{ $maxWidth: string }>`
  position: relative;
  display: flex;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth};
  height: fit-content;
  flex-direction: column;
  padding: 2rem;
  border-radius: 18px;
  background: var(--app-surface);
  color: var(--app-text);
  box-shadow: var(--app-shadow);

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

/**
 * A real button. The source hung `onClick` straight on the `Icon` svg, which is
 * neither focusable nor named — the modal could only be dismissed with a mouse.
 */
export const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: var(--app-surface-muted);
  color: var(--app-text);
  cursor: pointer;
  transition:
    background 120ms ease,
    color 120ms ease;

  &:hover {
    background: var(--app-border);
  }

  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
`;

/**
 * The scrolling region. The source meant to cap this — it had `max-h-[60h]`,
 * which isn't a valid CSS length so Tailwind emitted nothing, plus a correct
 * `.scrollable { max-height: 60vh }` rule that was never applied to any element.
 *
 * Scrollbars are left visible on purpose; the source hid them with
 * `scrollbar-width: none`, so there was no sign that content continued below.
 */
export const Body = styled.div`
  max-height: 60vh;
  overflow-y: auto;
`;
