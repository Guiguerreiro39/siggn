import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {},
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
  plugins: [
    dts({
      tsconfigPath: 'tsconfig.build.json',
      outDir: 'dist',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'tests/**'],
    }),
  ],
});
