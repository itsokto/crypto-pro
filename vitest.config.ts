import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      cadesplugin: path.resolve(__dirname, 'src/__mocks__/cadesplugin.ts'),
      'console-mock': path.resolve(__dirname, 'src/__mocks__/console-mock.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: ['src/vendor/**'],
    },
    exclude: ['examples/**', 'node_modules/**'],
  },
});
