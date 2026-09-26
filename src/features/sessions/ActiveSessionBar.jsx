import { ChevronRight, Dumbbell } from 'lucide-react'
import { Link } from 'react-router'
import { formatClock } from '../../lib/format.js'
import { useCurrentUser } from '../auth/useAuth.js'
import { useSessionDraft } from './sessionDraft.js'
import { useElapsedSeconds } from './useElapsed.js'
import styles from './ActiveSessionBar.module.css'

// Aviso fijo arriba cuando hay una sesión a medias y estás en otra pantalla:
// el borrador vive en el navegador, así que sin este recordatorio es fácil olvidarla.
export default function ActiveSessionBar() {
  const { data: user } = useCurrentUser()
  const draft = useSessionDraft(user._id)

  if (!draft) return null
  return <Bar draft={draft} />
}

// El reloj vive en su propio componente: así solo él se vuelve a dibujar cada segundo
function Bar({ draft }) {
  const elapsed = useElapsedSeconds(draft.startedAt)

  return (
    <div className={styles.wrapper}>
      <Link to="/sesion" className={styles.bar}>
        <span className={styles.icon} aria-hidden="true">
          <Dumbbell size={18} strokeWidth={2.5} />
        </span>
        <span className={styles.text}>
          <span className={styles.title}>Sesión en curso</span>
          <span className={styles.name}>{draft.routine?.name ?? 'Sesión libre'}</span>
        </span>
        <span className={`${styles.clock} num`}>{formatClock(elapsed)}</span>
        <ChevronRight size={20} aria-hidden="true" />
      </Link>
    </div>
  )
}
