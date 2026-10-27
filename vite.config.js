import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No base needed — custom domain (littlelights.co) means paths are root-relative
  base: '/',
})
