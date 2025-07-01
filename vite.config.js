import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  plugins: [react(), tailwindcss(),],
  server:{
    port:3000,
    proxy: {
      '/api': {
        target: 'https://tsp-api-yl3420.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
