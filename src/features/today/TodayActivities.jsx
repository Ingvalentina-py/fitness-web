import { ChevronRight, Dumbbell } from 'lucide-react'
import { Link } from 'react-router'
import GlassCard from '../../components/GlassCard.jsx'
import IconByName from '../../components/IconByName.jsx'
import { formatDuration, formatNumber, plural } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import styles from './TodayActivities.module.css'

// Todo lo registrado hoy: sesiones de gimnasio y otras actividades, en una sola lista.
// El historial completo (calendario y detalle del día) llega en la Fase 7.
export default function TodayActivities({ activities }) {
  const labels = useMetaLabels()

  return (
    <GlassCard aria-labelledby="today-activities-title">
      <h2 id="today-activities-title" className={styles.title}>
        Lo que hiciste hoy
      </h2>

      <ul className={styles.list}>
        {activities.map((activity) =>
          activity.kind === 'gym' ? (
            <li key={activity._id}>
              <Link to={`/sesion/${activity._id}/resumen`} className={styles.activity}>
                <GymIcon />
                <span className={styles.text}>
                  <span className={styles.name}>{activity.routine?.name ?? 'Sesión libre'}</span>
                  <span className={`${styles.details} num`}>
                    {formatNumber(activity.totalVolumeKg)} kg ·{' '}
                    {plural(activity.exercises.length, 'ejercicio', 'ejercicios')} ·{' '}
                    {formatDuration(activity.durationMinutes)}
                  </span>
                </span>
                <ChevronRight size={20} aria-hidden="true" />
              </Link>
            </li>
          ) : (
            <li key={activity._id} className={styles.activity}>
              <TypeIcon type={activity.activityType} />
              <span className={styles.text}>
                <span className={styles.name}>{activity.activityType?.name ?? 'Actividad'}</span>
                <span className={`${styles.details} num`}>
                  {[
                    formatDuration(activity.durationMinutes),
                    activity.intensity && `intensidad ${labels.intensity(activity.intensity).toLowerCase()}`,
                    activity.distanceKm != null && `${formatNumber(activity.distanceKm)} km`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
            </li>
          ),
        )}
      </ul>
    </GlassCard>
  )
}

function GymIcon() {
  return (
    <span className={styles.icon} style={{ '--tone': 'var(--activity-gym)' }} aria-hidden="true">
      <Dumbbell size={20} strokeWidth={2.25} />
    </span>
  )
}

function TypeIcon({ type }) {
  return (
    <span
      className={styles.icon}
      style={{ '--tone': type?.color ?? 'var(--color-orange)' }}
      aria-hidden="true"
    >
      <IconByName name={type?.icon} size={20} strokeWidth={2.25} />
    </span>
  )
}
