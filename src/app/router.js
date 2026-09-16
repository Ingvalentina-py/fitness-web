import { createBrowserRouter } from 'react-router'
import StatusPage from '../features/status/StatusPage.jsx'

// Rutas de la app. En la Fase 3 se agregan las pestañas (Hoy, Rutinas, Historial…).
export const router = createBrowserRouter([
  { path: '/', Component: StatusPage },
])
