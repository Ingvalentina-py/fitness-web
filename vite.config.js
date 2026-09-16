import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Si el puerto está ocupado, falla en vez de usar otro:
    // la API solo acepta peticiones (CORS) desde http://localhost:5173
    strictPort: true,
  },
})
