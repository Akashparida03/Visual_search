import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Minimal and stable config for Vercel + Tailwind v3
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // keep empty unless explicitly needed
    },
  },
})
