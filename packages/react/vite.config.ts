import { defineConfig } from 'vite';
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
      name: '@siggn/react',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    sourcemap: true,
    rollupOptions: {
      // Prevent bundling peer dependencies like React, etc.
      external: ['react', '@siggn/core'],
      output: {
        globals: {
          react: 'React',
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
    dts({
      tsconfigPath: 'tsconfig.build.json',
      outDir: 'dist',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'tests/**'],
    }),
  ],
});
