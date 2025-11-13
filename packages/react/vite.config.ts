/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
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
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
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
