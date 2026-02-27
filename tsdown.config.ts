import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/crypto-pro-browser.ts',
  format: ['esm', 'cjs', "umd"],
  globalName: 'cryptoPro',
  dts: true,
  outDir: 'dist',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  minify: true,
  inlineOnly: ['cadesplugin_api.js-actual'],
});
