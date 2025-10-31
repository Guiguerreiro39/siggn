/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SiggnCore',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [], // add external deps here (e.g., ['react'])
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.build.json',
      outDir: 'dist',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'tests/**'],
    }),
  ],
});
