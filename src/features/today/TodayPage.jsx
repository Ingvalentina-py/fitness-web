import { Link } from 'react-router'
import { useCurrentUser } from '../auth/useAuth.js'

// Pantalla provisional. En la Fase 3 se convierte en "Hoy", con navegación y diseño.
export default function TodayPage() {
  const { data: user } = useCurrentUser()

  return (
    <main className="page">
      <header>
        <p className="eyebrow">Fase 2 · Autenticación</p>
        <h1 className="page-title">Hola, {user.name}</h1>
        <p className="page-subtitle">
          Aquí estará la pantalla <strong>Hoy</strong> con el resumen de tu día.
        </p>
      </header>

      <nav className="card link-list" aria-label="Accesos">
        <Link to="/perfil">Tu perfil y preferencias</Link>
        <Link to="/estado">Estado de la conexión</Link>
      </nav>
    </main>
  )
}
