import { RefreshCw } from 'lucide-react'
import { Link } from 'react-router'
import Button from '../../components/Button.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { cx } from '../../lib/cx.js'
import { useApiHealth } from './useApiHealth.js'
import styles from './StatusPage.module.css'

const STATE_LABELS = {
  checking: 'Comprobando…',
  up: 'Conectado',
  down: 'Sin conexión',
  unknown: 'Sin datos',
}

const HINTS = {
  api: 'Inicia fitness-api con "npm run dev" en su carpeta.',
  database:
    'Revisa MONGODB_URI en el .env de fitness-api y el acceso de red (Network Access) en Atlas.',
}

// Traduce la respuesta de /health al estado de cada pieza.
function getStates({ isPending, data, error }) {
  if (isPending) return { api: 'checking', database: 'checking' }
  if (error?.status === 0 || error?.status === 502 || error?.status === 504) {
    // 502/504: el proxy de Vite no encontró la API
    return { api: 'down', database: 'unknown' }
  }

  // Si la base de datos falla, la API responde 503 y el detalle viene en error.data
  const health = data ?? error?.data
  return { api: 'up', database: health?.database === 'connected' ? 'up' : 'down' }
}

// Diagnóstico público: confirma que frontend, API y base de datos se comunican.
export default function StatusPage() {
  const { data, error, isPending, isFetching, refetch } = useApiHealth()
  const states = getStates({ isPending, data, error })

  return (
    <main className={styles.page}>
      <Stagger className={styles.column}>
        <Reveal>
          <PageHeader
            documentTitle="Estado"
            eyebrow="Diagnóstico"
            title="Estado de la conexión"
            subtitle="Comprobamos que el frontend, la API y la base de datos se comunican."
          />
        </Reveal>

        <Reveal>
          <GlassCard>
            <ul className={styles.list} aria-live="polite">
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

            <Button icon={RefreshCw} onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Comprobando…' : 'Comprobar de nuevo'}
            </Button>
            <Link className={styles.back} to="/">
              Volver al inicio
            </Link>
          </GlassCard>
        </Reveal>
      </Stagger>
    </main>
  )
}

function StatusItem({ label, state, hint }) {
  return (
    <li className={styles.item}>
      <span className={cx(styles.dot, styles[state])} aria-hidden="true" />
      <div>
        <p className={styles.label}>{label}</p>
        <p className={styles.state}>{STATE_LABELS[state]}</p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    </li>
  )
}
