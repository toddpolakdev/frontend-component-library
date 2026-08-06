import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    // styled-components renders in jsdom are slow; give heavy component
    // trees headroom so parallel workers don't hit the default 5s timeout.
    testTimeout: 20000,
  },
});
