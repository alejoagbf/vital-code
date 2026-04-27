import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy para evitar CORS durante desarrollo
      '/api': {
        target: 'http://localhost:8080', // Puerto por defecto de Spring Boot
        changeOrigin: true,
      },
    },
  },
})