import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@charset "UTF-8"; @use "sass:math"; @import "@/assets/styles/meta.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  build: {
    sourcemap: true,
  },
});
