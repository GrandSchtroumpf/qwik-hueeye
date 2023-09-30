import type { LibraryFormats } from "vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";
import dts from 'vite-plugin-dts'

export default extendConfig(baseConfig, () => {
  return {
    plugins: [dts({
      entryRoot: './src/components',
      outDir: './lib-types',
      rollupTypes: true
    })],
    build: {
      target: 'es2020',
      lib: {
        entry: './src/components/index.ts',
        formats: ['es', 'cjs'] as LibraryFormats[],
        fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        // preserveModules: true,
      }
    },
  };
});
