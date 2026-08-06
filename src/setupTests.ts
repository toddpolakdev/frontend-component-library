import '@testing-library/jest-dom/vitest';

// This jsdom build does not provide a working localStorage; supply a minimal
// in-memory implementation so storage-backed components (e.g. ThemeToggle) work.
if (typeof window !== 'undefined' && typeof window.localStorage?.getItem !== 'function') {
  const store = new Map<string, string>();
  const localStorageStub: Storage = {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageStub,
    configurable: true,
  });
}

// jsdom does not implement matchMedia; provide a minimal stub so components
// that read prefers-color-scheme (e.g. ThemeToggle) can render under test.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
