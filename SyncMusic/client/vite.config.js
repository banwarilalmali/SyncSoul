// TODO: Add production build chunking and final PWA asset configuration.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'SyncMusic',
        short_name: 'SyncMusic',
        description: 'Listen together and chat together',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        start_url: '/'
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5000', ws: true }
    }
  }
});
