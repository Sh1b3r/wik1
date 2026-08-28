import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base відповідає шляху проєкту на GitHub Pages
export default defineConfig({
  base: '/wik1/',
  plugins: [react()],
})
