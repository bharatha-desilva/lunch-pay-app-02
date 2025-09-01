import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['lucide-react', 'date-fns'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          motion: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
