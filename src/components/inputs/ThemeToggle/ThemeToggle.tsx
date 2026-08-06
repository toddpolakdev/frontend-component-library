import { useEffect, useSyncExternalStore } from 'react';

import { ToggleButton } from './ThemeToggle.styles';

type Theme = 'light' | 'dark';

const themeStorageKey = 'theme';
const themeChangeEventName = 'app-theme-change';

const SunIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);

  if (isTheme(savedTheme)) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeSnapshot(): Theme {
  return getPreferredTheme();
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener('storage', handleChange);
  window.addEventListener(themeChangeEventName, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(themeChangeEventName, handleChange);
  };
}

function saveTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(themeChangeEventName));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    saveTheme(theme === 'light' ? 'dark' : 'light');
  }

  const isDark = theme === 'dark';

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </ToggleButton>
  );
}

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
