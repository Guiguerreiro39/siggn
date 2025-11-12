/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@siggn/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SiggnReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Prevent bundling peer dependencies like React, etc.
      external: ['react', 'react-dom', '@siggn/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@siggn/core': 'SiggnCore',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.build.json',
      outDir: 'dist',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'tests/**'],
    }),
  ],
});
