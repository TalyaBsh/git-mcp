import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { resolve } from 'path';

export default defineConfig({
  plugins: [cloudflare()],
  resolve: {
    alias: {
      // Add this alias to help resolve the virtual module
      'virtual:react-router/server-build': resolve(__dirname, '.react-router/types/+virtual.d.ts')
    }
  },
  build: {
    rollupOptions: {
      external: ['virtual:react-router/server-build']
    }
  }
});