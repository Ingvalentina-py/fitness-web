import '@fontsource-variable/archivo/wdth.css'
import './styles/tokens.css'
import './styles/themes.css'
import './styles/base.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { queryClient } from './app/queryClient.js'
import { router } from './app/router.js'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import { applyTheme, readStoredTheme } from './lib/theme.js'

// Antes del primer dibujo: evita ver el tema por defecto y que cambie a mitad de carga
applyTheme(readStoredTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* reducedMotion="user": respeta la opción "reducir movimiento" del sistema */}
      <MotionConfig reducedMotion="user">
        <AnimatedBackground />
        <RouterProvider router={router} />
      </MotionConfig>
    </QueryClientProvider>
  </StrictMode>,
)
