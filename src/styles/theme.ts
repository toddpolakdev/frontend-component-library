export const primaryButtonStyles = {
  base:
    'relative inline-flex select-none items-center justify-center overflow-hidden rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
  responsive:
    'w-full px-4 py-2 text-sm min-h-[2.75rem] sm:w-auto sm:px-5 sm:text-base sm:min-h-[3rem] lg:px-6 lg:min-h-[3.25rem]',
  content: 'inline-flex items-center justify-center gap-2',
  icon: 'inline-flex shrink-0 items-center justify-center',
  loadingContent: 'opacity-0',
  spinnerOverlay: 'absolute inset-0 flex items-center justify-center gap-2 text-current',
  theme: {
    light:
      'bg-sky-600 text-white shadow-sm hover:bg-sky-500 active:bg-sky-700 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none',
    dark:
      'bg-sky-500 text-slate-950 shadow-sm hover:bg-sky-400 active:bg-sky-300 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none',
    system:
      'bg-sky-600 text-white shadow-sm hover:bg-sky-500 active:bg-sky-700 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 dark:active:bg-sky-300 dark:focus-visible:ring-offset-slate-950 dark:disabled:bg-slate-700 dark:disabled:text-slate-400',
  },
} as const;

export type PrimaryButtonThemeMode = keyof typeof primaryButtonStyles.theme;
