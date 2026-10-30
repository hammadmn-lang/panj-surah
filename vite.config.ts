import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png', 'app-logo.jpg', 'assets/images/app_logo_1791491470615.jpg', 'screenshots/*.png'],
        manifest: {
          id: '/',
          name: 'Panj Surah - Daily Prayers',
          short_name: 'Panj Surah',
          description: 'Authentic Panj Surah, Daily Prayer Times with Adhan notifications, Qibla Compass, Durood Sharif, Duas, and Digital Tasbeeh.',
          theme_color: '#064e3b',
          background_color: '#0a0a0a',
          display: 'standalone',
          orientation: 'portrait',
          categories: ['lifestyle', 'books', 'education'],
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshots/prayer.png',
              sizes: '768x1376',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Prayer Times & Qibla Compass',
            },
            {
              src: '/screenshots/surahs.png',
              sizes: '768x1376',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Panj Surah Recitation & Audio',
            },
            {
              src: '/screenshots/duas.png',
              sizes: '768x1376',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Daily Duas & Supplications',
            },
            {
              src: '/screenshots/tasbeeh.png',
              sizes: '768x1376',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Digital Tasbeeh Counter',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
