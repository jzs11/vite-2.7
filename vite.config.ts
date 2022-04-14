import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import https from 'https';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({ typescript: true, vueTsc: true }),
    eslintPlugin({ cache: true, fix: true, exclude: ['node_modules', './src/components/VCoverImage.vue'] }),
  ],

  server: {
    port: 8888,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'https://systemis-web-staging-2.azurewebsites.net/',
        changeOrigin: true,
        secure: false,
        ws: true,
        agent: new https.Agent(),
      },
    },
  },
  define: {
    'process.env': {},
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      { find: 'devextreme/ui', replacement: 'devextreme/esm/ui' },
      // {
      //   find: '@vue/runtime-core',
      //   replacement: '@vue/runtime-core/dist/runtime-core.esm-bundler.js',
      // },
    ],
  },
  css: { preprocessorOptions: { css: { charset: false } } },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
        },
      },
    },
  },
});
