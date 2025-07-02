import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  plugins: [react()],
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
