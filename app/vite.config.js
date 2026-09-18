import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base підтримує Vercel (/), локальну розробку (/) та GitHub Pages (/wik1/)
export default defineConfig({
  base: process.env.BASE_URL ?? (process.env.GITHUB_PAGES ? '/wik1/' : '/'),
  plugins: [react()],
})
