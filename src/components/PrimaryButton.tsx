import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { primaryButtonStyles, type PrimaryButtonThemeMode } from '../styles/theme';

export interface PrimaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  ariaLabel?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingLabel?: string;
  fullWidthOnMobile?: boolean;
  themeMode?: PrimaryButtonThemeMode;
}

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const Spinner = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 animate-spin sm:h-5 sm:w-5"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" className="opacity-25" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-90"
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="4"
    />
  </svg>
);

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      ariaLabel,
      children,
      className,
      disabled = false,
      fullWidthOnMobile = true,
      icon,
      iconPosition = 'left',
      isLoading = false,
      loadingLabel = 'Loading',
      themeMode = 'system',
      type = 'button',
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const themeClasses = primaryButtonStyles.theme[themeMode];

    return (
      <button
        {...buttonProps}
        ref={ref}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={ariaLabel}
        data-theme-mode={themeMode}
        disabled={isDisabled}
        type={type}
        className={cx(
          primaryButtonStyles.base,
          primaryButtonStyles.responsive,
          themeClasses,
          !fullWidthOnMobile && 'w-auto',
          className,
        )}
      >
        {isLoading ? (
          <span className={primaryButtonStyles.spinnerOverlay}>
            <Spinner />
            <span aria-live="polite" className="sr-only">
              {loadingLabel}
            </span>
          </span>
        ) : null}

        <span className={cx(primaryButtonStyles.content, isLoading && primaryButtonStyles.loadingContent)}>
          {icon && iconPosition === 'left' ? (
            <span aria-hidden="true" className={primaryButtonStyles.icon}>
              {icon}
            </span>
          ) : null}
          <span>{children}</span>
          {icon && iconPosition === 'right' ? (
            <span aria-hidden="true" className={primaryButtonStyles.icon}>
              {icon}
            </span>
          ) : null}
        </span>
      </button>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
