import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      // MSW owns the root worker in demo mode. PWA is tested in live production builds.
      disable: mode === 'demo',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'games/*.svg'],
      manifest: {
        name: 'Boardgame Advisor',
        short_name: 'Boardgame',
        lang: 'vi',
        description: 'Tìm một boardgame hợp gu cho buổi chơi của bạn.',
        theme_color: '#234e40',
        background_color: '#f7f7f2',
        display: 'standalone',
        start_url: '/games',
        scope: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['**/mockServiceWorker.js'],
        navigateFallbackDenylist: [/^\/api\//],
        // Do not cache API calls, sessions, private shelves, or AI responses.
        runtimeCaching: [],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: { port: 5173, strictPort: true, proxy: { '/api': 'http://localhost:3000' } },
  preview: { port: 4173, strictPort: true },
}));
