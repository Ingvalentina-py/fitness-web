import { Navigate, Outlet, useLocation } from 'react-router'
import PageMessage from '../../components/PageMessage.jsx'
import { useCurrentUser } from './useAuth.js'

// Envuelve inicio de sesión y registro: si ya hay sesión, no tiene sentido verlas.
// Al iniciar sesión, esta misma redirección lleva a la página que se quería visitar.
export default function GuestOnly() {
  const { data: user, isPending } = useCurrentUser()
  const location = useLocation()

  if (isPending) return <PageMessage>Cargando…</PageMessage>

  if (user) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />

  return <Outlet />
}
