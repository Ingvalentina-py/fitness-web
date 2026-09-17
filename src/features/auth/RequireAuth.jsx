import { Navigate, Outlet, useLocation } from 'react-router'
import Button from '../../components/Button.jsx'
import PageMessage from '../../components/PageMessage.jsx'
import { useCurrentUser } from './useAuth.js'

// Envuelve las rutas privadas: si no hay sesión, lleva a /ingresar
// recordando a dónde se quería ir.
export default function RequireAuth() {
  const { data: user, isPending, isError, refetch } = useCurrentUser()
  const location = useLocation()

  if (user) return <Outlet />

  if (isPending) return <PageMessage>Cargando…</PageMessage>

  if (isError) {
    return (
      <PageMessage>
        <p>No pudimos conectar con el servidor.</p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </PageMessage>
    )
  }

  return <Navigate to="/ingresar" replace state={{ from: location }} />
}
