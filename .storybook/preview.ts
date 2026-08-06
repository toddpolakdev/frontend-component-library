import type { Preview } from '@storybook/react';

import '../src/index.css';

const preview: Preview = {
  parameters: {
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
