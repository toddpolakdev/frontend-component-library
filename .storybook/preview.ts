import type { Preview } from '@storybook/react';

import '../src/index.css';

const preview: Preview = {
  parameters: {
    // Without this the sidebar follows story-file paths, so components come out
    // grouped by their src/components/<group>/ folder instead of by name.
    //
    // Sorting only when the titles differ keeps components A–Z while leaving the
    // stories inside each one in the order they're written (Default first) —
    // `method: 'alphabetical'` would reorder those too.
    //
    // Storybook pulls this function out of the source and evaluates it as plain
    // JavaScript, so it must stay self-contained: no type annotations (they parse
    // as a syntax error) and no references to imports or outer variables.
    options: {
      storySort: (a, b) =>
        a.title === b.title ? 0 : a.title.localeCompare(b.title, 'en', { numeric: true }),
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#f8fafc' },
        dark: { name: 'dark', value: '#020617' }
      }
    },
    layout: 'centered',
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;
