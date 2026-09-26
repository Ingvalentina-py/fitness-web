import { ChevronRight, Dumbbell } from 'lucide-react'
import { Link } from 'react-router'
import GlassCard from '../../components/GlassCard.jsx'
import { formatDuration, formatNumber, plural } from '../../lib/format.js'
import styles from './TodaySessions.module.css'

// Sesiones de gimnasio registradas hoy. El historial completo llega en la Fase 7.
export default function TodaySessions({ sessions }) {
  return (
    <GlassCard aria-labelledby="today-sessions-title">
      <h2 id="today-sessions-title" className={styles.title}>
        Lo que entrenaste hoy
      </h2>

      <ul className={styles.list}>
        {sessions.map((session) => (
          <li key={session._id}>
            <Link to={`/sesion/${session._id}/resumen`} className={styles.session}>
              <span className={styles.icon} aria-hidden="true">
                <Dumbbell size={20} strokeWidth={2.25} />
              </span>
              <span className={styles.text}>
                <span className={styles.name}>{session.routine?.name ?? 'Sesión libre'}</span>
                <span className={`${styles.details} num`}>
                  {formatNumber(session.totalVolumeKg)} kg ·{' '}
                  {plural(session.exercises.length, 'ejercicio', 'ejercicios')} ·{' '}
                  {formatDuration(session.durationMinutes)}
                </span>
              </span>
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
