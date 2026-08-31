import styled, { css, keyframes } from 'styled-components';

export type PrimaryButtonThemeMode = 'light' | 'dark' | 'system';
export type PrimaryButtonVariant = 'primary' | 'secondary' | 'danger' | 'naked';
export type PrimaryButtonSize = 'default' | 'slim';

const palette = {
  sky300: '#7dd3fc',
  sky400: '#38bdf8',
  sky500: '#0ea5e9',
  sky600: '#0284c7',
  sky700: '#0369a1',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate700: '#334155',
  slate950: '#020617',
  white: '#ffffff',
} as const;

const lightTheme = css`
  background-color: ${palette.sky600};
  color: ${palette.white};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover:not(:disabled) {
    background-color: ${palette.sky500};
  }
  &:active:not(:disabled) {
    background-color: ${palette.sky700};
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px ${palette.white}, 0 0 0 4px ${palette.sky500};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${palette.slate300};
    color: ${palette.slate500};
    box-shadow: none;
  }
`;

const darkTheme = css`
  background-color: ${palette.sky500};
  color: ${palette.slate950};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover:not(:disabled) {
    background-color: ${palette.sky400};
  }
  &:active:not(:disabled) {
    background-color: ${palette.sky300};
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px ${palette.slate950}, 0 0 0 4px ${palette.sky500};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${palette.slate700};
    color: ${palette.slate400};
    box-shadow: none;
  }
`;

const themeStyles: Record<PrimaryButtonThemeMode, ReturnType<typeof css>> = {
  light: lightTheme,
  dark: darkTheme,
  system: css`
    ${lightTheme}

    @media (prefers-color-scheme: dark) {
      ${darkTheme}
    }
  `,
};

const secondaryVariant = css`
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover:not(:disabled) {
    background-color: #f8fafc;
  }
  &:active:not(:disabled) {
    background-color: #f1f5f9;
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0ea5e9;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #f8fafc;
    color: #94a3b8;
    box-shadow: none;
  }
`;

const dangerVariant = css`
  background-color: #dc2626;
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

  &:hover:not(:disabled) {
    background-color: #b91c1c;
  }
  &:active:not(:disabled) {
    background-color: #991b1b;
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #dc2626;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #fca5a5;
    color: #fef2f2;
    box-shadow: none;
  }
`;

/**
 * The source library's `naked` variant: a text button with no chrome, for
 * inline actions that shouldn't look like a filled control. Its `ghost` variant
 * isn't carried over — `secondary` already covers the bordered-light case.
 */
const nakedVariant = css`
  background-color: transparent;
  color: inherit;
  border: none;
  box-shadow: none;
  padding: 0;
  min-height: 0;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover:not(:disabled) {
    background-color: transparent;
    text-decoration: none;
  }
  &:focus-visible {
    outline: 2px solid var(--app-primary);
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--app-muted);
    text-decoration: none;
  }

  /* Undoes the responsive sizing above, which a text button shouldn't carry. */
  @media (min-width: 640px) {
    padding: 0;
    min-height: 0;
  }
  @media (min-width: 1024px) {
    padding: 0;
    min-height: 0;
  }
`;

/** The source's `slim`: shorter, and not upper-cased. */
const slimSize = css`
  padding: 0.25rem 0.75rem;
  min-height: 2rem;
  font-size: 0.875rem;
  text-transform: none;

  @media (min-width: 640px) {
    padding: 0.25rem 0.875rem;
    min-height: 2.25rem;
    font-size: 0.875rem;
  }

  @media (min-width: 1024px) {
    padding: 0.25rem 1rem;
    min-height: 2.25rem;
  }
`;

export const StyledButton = styled.button<{
  $themeMode: PrimaryButtonThemeMode;
  $variant: PrimaryButtonVariant;
  $size: PrimaryButtonSize;
  $fullWidthOnMobile: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  border: none;
  border-radius: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  outline: none;

  width: ${(props) => (props.$fullWidthOnMobile ? '100%' : 'auto')};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  min-height: 2.75rem;

  @media (min-width: 640px) {
    width: auto;
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    min-height: 3rem;
  }

  @media (min-width: 1024px) {
    padding: 0.5rem 1.5rem;
    min-height: 3.25rem;
  }

  ${(props) => props.$size === 'slim' && slimSize}

  ${(props) =>
    props.$variant === 'secondary'
      ? secondaryVariant
      : props.$variant === 'danger'
        ? dangerVariant
        : props.$variant === 'naked'
          ? nakedVariant
          : themeStyles[props.$themeMode]}

  /* Pressed state for toggle buttons, from the source's \`active\` prop. */
  &[aria-pressed='true'] {
    filter: brightness(0.92);
  }
`;

export const Content = styled.span<{ $loading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  ${(props) =>
    props.$loading &&
    css`
      opacity: 0;
    `}
`;

export const IconWrapper = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export const SpinnerOverlay = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: currentColor;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const SpinnerSvg = styled.svg`
  width: 1rem;
  height: 1rem;
  animation: ${spin} 1s linear infinite;

  @media (min-width: 640px) {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
