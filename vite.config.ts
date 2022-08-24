/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: process.env.VITEST ? 'global' : 'globalThis',
  },
  plugins: [
    svgrPlugin({
      exportAsDefault: true,
      svgrOptions: {
        svgo: true,
      },
    }),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    deps: {
      inline: ['@rainbow-me/rainbowkit'],
    },
  },
});
