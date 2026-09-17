import { createBrowserRouter } from 'react-router'
import GuestOnly from '../features/auth/GuestOnly.jsx'
import LoginPage from '../features/auth/LoginPage.jsx'
import RegisterPage from '../features/auth/RegisterPage.jsx'
import RequireAuth from '../features/auth/RequireAuth.jsx'
import ExerciseCatalogPage from '../features/exercises/ExerciseCatalogPage.jsx'
import HistoryPage from '../features/history/HistoryPage.jsx'
import ProfilePage from '../features/profile/ProfilePage.jsx'
import ProgressPage from '../features/progress/ProgressPage.jsx'
import RoutineEditorPage from '../features/routines/RoutineEditorPage.jsx'
import RoutinesPage from '../features/routines/RoutinesPage.jsx'
import WeeklyPlanPage from '../features/routines/WeeklyPlanPage.jsx'
import StatusPage from '../features/status/StatusPage.jsx'
import TodayPage from '../features/today/TodayPage.jsx'
import AppLayout from './layout/AppLayout.jsx'
import NotFoundPage from './NotFoundPage.jsx'

// Las rutas sin `path` son "envoltorios": deciden si y cómo se muestran sus rutas hijas.
export const router = createBrowserRouter([
  { path: '/estado', Component: StatusPage },

  // Guía de estilos: solo en desarrollo. En producción esta ruta ni siquiera se compila.
  import.meta.env.DEV && {
    path: '/estilos',
    lazy: async () => ({
      Component: (await import('../features/styleguide/StyleGuidePage.jsx')).default,
    }),
  },

  // Solo sin sesión
  {
    Component: GuestOnly,
    children: [
      { path: '/ingresar', Component: LoginPage },
      { path: '/registro', Component: RegisterPage },
    ],
  },

  // Solo con sesión, dentro de la estructura con navegación
  {
    Component: RequireAuth,
    children: [
      {
        Component: AppLayout,
        children: [
          { path: '/', Component: TodayPage },
          { path: '/rutinas', Component: RoutinesPage },
          { path: '/rutinas/nueva', Component: RoutineEditorPage },
          { path: '/rutinas/plan', Component: WeeklyPlanPage },
          { path: '/rutinas/:routineId', Component: RoutineEditorPage },
          { path: '/historial', Component: HistoryPage },
          { path: '/progreso', Component: ProgressPage },
          { path: '/perfil', Component: ProfilePage },
          { path: '/perfil/ejercicios', Component: ExerciseCatalogPage },
        ],
      },
    ],
  },

  { path: '*', Component: NotFoundPage },
].filter(Boolean))
