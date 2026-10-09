import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const API_TARGET = process.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Collapse the hundreds of one-icon-per-chunk modules emitted by
        // lucide-react's per-icon entry points into a single cached chunk.
        // All other splitting is left to Vite/Rolldown's defaults.
        manualChunks(id) {
          if (id.replace(/\\/g, '/').includes('/lucide-react/')) return 'vendor-icons'
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/admin': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/static': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/media': {
        target: API_TARGET,
        changeOrigin: true,
      },
      '/ws': {
        target: API_TARGET.replace(/^http/, 'ws'),
        ws: true,
      },
    },
  },
})
