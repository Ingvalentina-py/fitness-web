import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Si el puerto está ocupado, falla en vez de usar otro silenciosamente
    strictPort: true,
    // Las peticiones a /api se reenvían a fitness-api. Para el navegador todo sale
    // del mismo origen (localhost:5173), así la cookie de sesión funciona igual que
    // en producción, donde Vercel hará lo mismo con un rewrite.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
