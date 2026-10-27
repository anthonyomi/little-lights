import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No base needed — custom domain (littlelights.co) means paths are root-relative
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into its own chunk — cached independently of app code
          'firebase-core': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-db': ['firebase/database'],
          'firebase-storage': ['firebase/storage'],
          // Split React into its own chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
})
