import React, { forwardRef } from 'react';

export interface PrimaryButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  ariaLabel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidthOnMobile?: boolean;
  themeMode?: 'light' | 'dark' | 'system';
}

const baseClasses =
  'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500';

const sizeClasses =
  'min-h-[2.75rem] px-4 py-2 text-sm sm:min-h-[3rem] sm:px-5 sm:text-base lg:min-h-[3.25rem] lg:px-6';

const lightThemeClasses =
  'bg-sky-600 text-white shadow-sm hover:bg-sky-500 active:bg-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none';

const darkThemeClasses =
  'bg-sky-500 text-slate-950 shadow-sm hover:bg-sky-400 active:bg-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none';

const systemThemeClasses =
  'bg-sky-600 text-white shadow-sm hover:bg-sky-500 active:bg-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 dark:active:bg-sky-300 dark:focus-visible:ring-offset-slate-950 dark:disabled:bg-slate-700 dark:disabled:text-slate-400';

const widthClasses = 'w-full sm:w-auto';
const contentHiddenWhenLoading = 'text-transparent';

const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin sm:h-5 sm:w-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-90"
      d="M22 12a10 10 0 0 0-10-10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (
    {
      ariaLabel,
      children,
      className = '',
      disabled = false,
      fullWidthOnMobile = true,
      icon,
      iconPosition = 'left',
      isLoading = false,
      themeMode = 'system',
      type = 'button',
      ...buttonProps
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const themeClasses =
      themeMode === 'dark'
        ? darkThemeClasses
        : themeMode === 'light'
          ? lightThemeClasses
          : systemThemeClasses;

    const content = (
      <>
        {icon && iconPosition === 'left' ? <span aria-hidden="true">{icon}</span> : null}
        <span>{children}</span>
        {icon && iconPosition === 'right' ? <span aria-hidden="true">{icon}</span> : null}
      </>
    );

    return (
      <button
        {...buttonProps}
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        aria-busy={isLoading || undefined}
        className={[
          baseClasses,
          sizeClasses,
          themeClasses,
          fullWidthOnMobile ? widthClasses : '',
          isLoading ? contentHiddenWhenLoading : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={isDisabled}
      >
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-current">
            <Spinner />
            <span className="sr-only">Loading</span>
          </span>
        ) : null}
        <span
          className={[
            'inline-flex items-center justify-center gap-2',
            isLoading ? 'invisible' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content}
        </span>
      </button>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
