import { useApiHealth } from './useApiHealth.js'
import './StatusPage.css'

const STATE_LABELS = {
  checking: 'Comprobando…',
  up: 'Conectado',
  down: 'Sin conexión',
  unknown: 'Sin datos',
}

const HINTS = {
  api: 'Inicia fitness-api con "npm run dev" y revisa VITE_API_URL en el .env de fitness-web.',
  database:
    'Revisa MONGODB_URI en el .env de fitness-api y el acceso de red (Network Access) en Atlas.',
}

// Traduce la respuesta de /health al estado de cada pieza.
function getStates({ isPending, data, error }) {
  if (isPending) return { api: 'checking', database: 'checking' }
  if (error?.status === 0) return { api: 'down', database: 'unknown' }

  // Si la base de datos falla, la API responde 503 y el detalle viene en error.data
  const health = data ?? error?.data
  return { api: 'up', database: health?.database === 'connected' ? 'up' : 'down' }
}

// Pantalla temporal de la Fase 0: confirma que frontend, API y base de datos se comunican.
export default function StatusPage() {
  const { data, error, isPending, isFetching, refetch } = useApiHealth()
  const states = getStates({ isPending, data, error })

  return (
    <main className="status-page">
      <header>
        <p className="status-page__eyebrow">Fase 0 · Preparación</p>
        <h1 className="status-page__title">App Fitness</h1>
        <p>Comprobamos que el frontend, la API y la base de datos se comunican.</p>
      </header>

      <ul className="status-list" aria-live="polite">
        <StatusItem label="Frontend (React + Vite)" state="up" />
        <StatusItem
          label="API (Express)"
          state={states.api}
          hint={states.api === 'down' ? HINTS.api : null}
        />
        <StatusItem
          label="Base de datos (MongoDB Atlas)"
          state={states.database}
          hint={states.database === 'down' ? HINTS.database : null}
        />
      </ul>

      <button
        type="button"
        className="status-page__button"
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? 'Comprobando…' : 'Comprobar de nuevo'}
      </button>
    </main>
  )
}

function StatusItem({ label, state, hint }) {
  return (
    <li className="status-item">
      <span className={`status-item__dot status-item__dot--${state}`} aria-hidden="true" />
      <div>
        <p className="status-item__label">{label}</p>
        <p className="status-item__state">{STATE_LABELS[state]}</p>
        {hint && <p className="status-item__hint">{hint}</p>}
      </div>
    </li>
  )
}
