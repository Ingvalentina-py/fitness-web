import { createBrowserRouter } from 'react-router'
import GuestOnly from '../features/auth/GuestOnly.jsx'
import LoginPage from '../features/auth/LoginPage.jsx'
import RegisterPage from '../features/auth/RegisterPage.jsx'
import RequireAuth from '../features/auth/RequireAuth.jsx'
import StatusPage from '../features/status/StatusPage.jsx'
import TodayPage from '../features/today/TodayPage.jsx'
import AppLayout from './layout/AppLayout.jsx'
import NotFoundPage from './NotFoundPage.jsx'

// Las pantallas que no se ven al abrir la app se cargan cuando se visitan.
// `lazy` de React Router parte el paquete por rutas: al entrar solo se descarga
// Hoy (y lo compartido), no el calendario ni las gráficas de Progreso.
const lazyPage = (load) => async () => ({ Component: (await load()).default })

// Las rutas sin `path` son "envoltorios": deciden si y cómo se muestran sus rutas hijas.
export const router = createBrowserRouter([
  { path: '/estado', Component: StatusPage },

  // Guía de estilos: solo en desarrollo. En producción esta ruta ni siquiera se compila.
  import.meta.env.DEV && {
    path: '/estilos',
    lazy: lazyPage(() => import('../features/styleguide/StyleGuidePage.jsx')),
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
          {
            path: '/rutinas',
            lazy: lazyPage(() => import('../features/routines/RoutinesPage.jsx')),
          },
          {
            path: '/rutinas/nueva',
            lazy: lazyPage(() => import('../features/routines/RoutineEditorPage.jsx')),
          },
          {
            path: '/rutinas/plan',
            lazy: lazyPage(() => import('../features/routines/WeeklyPlanPage.jsx')),
          },
          {
            path: '/rutinas/:routineId',
            lazy: lazyPage(() => import('../features/routines/RoutineEditorPage.jsx')),
          },
          { path: '/sesion', lazy: lazyPage(() => import('../features/sessions/SessionPage.jsx')) },
          {
            path: '/sesion/:sessionId/resumen',
            lazy: lazyPage(() => import('../features/sessions/SessionSummaryPage.jsx')),
          },
          {
            path: '/sesion/:sessionId/editar',
            lazy: lazyPage(() => import('../features/sessions/SessionEditPage.jsx')),
          },
          {
            path: '/historial',
            lazy: lazyPage(() => import('../features/history/HistoryPage.jsx')),
          },
          {
            path: '/progreso',
            lazy: lazyPage(() => import('../features/progress/ProgressPage.jsx')),
          },
          { path: '/perfil', lazy: lazyPage(() => import('../features/profile/ProfilePage.jsx')) },
          {
            path: '/perfil/ejercicios',
            lazy: lazyPage(() => import('../features/exercises/ExerciseCatalogPage.jsx')),
          },
          {
            path: '/perfil/actividades',
            lazy: lazyPage(() => import('../features/activities/ActivityTypesPage.jsx')),
          },
          {
            path: '/perfil/frases',
            lazy: lazyPage(() => import('../features/phrases/PhrasesPage.jsx')),
          },
        ],
      },
    ],
  },

  { path: '*', Component: NotFoundPage },
].filter(Boolean))
