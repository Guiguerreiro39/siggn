import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@siggn/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@siggn/react': path.resolve(__dirname, '../../packages/react/src/index.ts'),
    },
  },
});
