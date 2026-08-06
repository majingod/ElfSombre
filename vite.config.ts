/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/ElfSombre/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: '/ElfSombre/',
        name: 'Grimoire 3.5',
        short_name: 'Grimoire 3.5',
        description:
          "Compagnon de joueur hors-ligne pour Donjons & Dragons édition 3.5 : fiche de personnage à calculs automatiques, créateur pas-à-pas et compendium SRD.",
        lang: 'fr',
        start_url: '/ElfSombre/',
        scope: '/ElfSombre/',
        display: 'standalone',
        background_color: '#1a0f2e',
        theme_color: '#581c87',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}', 'data/*.json'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
