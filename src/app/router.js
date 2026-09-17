import { createBrowserRouter } from 'react-router'
import GuestOnly from '../features/auth/GuestOnly.jsx'
import LoginPage from '../features/auth/LoginPage.jsx'
import RegisterPage from '../features/auth/RegisterPage.jsx'
import RequireAuth from '../features/auth/RequireAuth.jsx'
import ProfilePage from '../features/profile/ProfilePage.jsx'
import StatusPage from '../features/status/StatusPage.jsx'
import TodayPage from '../features/today/TodayPage.jsx'
import NotFoundPage from './NotFoundPage.jsx'

// Las rutas sin `path` son "envoltorios": deciden si se muestran sus rutas hijas.
export const router = createBrowserRouter([
  { path: '/estado', Component: StatusPage },

  // Solo sin sesión
  {
    Component: GuestOnly,
    children: [
      { path: '/ingresar', Component: LoginPage },
      { path: '/registro', Component: RegisterPage },
    ],
  },

  // Solo con sesión. En la Fase 3 se agregan las pestañas (Hoy, Rutinas, Historial…)
  {
    Component: RequireAuth,
    children: [
      { path: '/', Component: TodayPage },
      { path: '/perfil', Component: ProfilePage },
    ],
  },

  { path: '*', Component: NotFoundPage },
])
