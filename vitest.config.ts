import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['vitest.setup.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: ['src/vendor/**'],
    },
    exclude: ['examples/**', 'node_modules/**'],
  },
});
