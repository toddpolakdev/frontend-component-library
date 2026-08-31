import { useEffect, useSyncExternalStore } from 'react';

import { Icon } from '../../data-display';
import { ToggleButton } from './ThemeToggle.styles';

type Theme = 'light' | 'dark';

const themeStorageKey = 'theme';
const themeChangeEventName = 'app-theme-change';

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
      <Icon variant={isDark ? 'Sun' : 'Moon'} size={16} />
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </ToggleButton>
  );
}

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
