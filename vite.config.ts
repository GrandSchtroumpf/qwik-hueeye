import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
// import '@oddbird/popover-polyfill';

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    // build: {
    //   cssMinify: 'lightningcss' as const,
    // },
    css: {
      // transformer: 'lightningcss' as const,
      // lightningcss: {
      //   drafts: {
      //     nesting: true,
      //     customMedia: true
      //   }
      // },
      modules: {
        localsConvention: 'camelCaseOnly' as const
      }
    }
  };
});
