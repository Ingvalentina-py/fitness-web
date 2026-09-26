import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import GlassCard from '../../components/GlassCard.jsx'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { activityDetails, activityLook } from '../activities/activityLook.js'
import styles from './TodayActivities.module.css'

// Todo lo registrado hoy: sesiones de gimnasio y otras actividades, en una sola lista.
// El calendario y el detalle de cualquier día están en Historial.
export default function TodayActivities({ activities }) {
  const labels = useMetaLabels()

  return (
    <GlassCard aria-labelledby="today-activities-title">
      <h2 id="today-activities-title" className={styles.title}>
        Lo que hiciste hoy
      </h2>

      <ul className={styles.list}>
        {activities.map((activity) => {
          const { color, Icon, name } = activityLook(activity)
          const content = (
            <>
              <span className={styles.icon} style={{ '--tone': color }} aria-hidden="true">
                <Icon size={20} strokeWidth={2.25} />
              </span>
              <span className={styles.text}>
                <span className={styles.name}>{name}</span>
                <span className={`${styles.details} num`}>{activityDetails(activity, labels)}</span>
              </span>
              {activity.kind === 'gym' && <ChevronRight size={20} aria-hidden="true" />}
            </>
          )

          return (
            <li key={activity._id}>
              {/* La sesión lleva a su resumen; las demás actividades se ven completas aquí */}
              {activity.kind === 'gym' ? (
                <Link to={`/sesion/${activity._id}/resumen`} className={styles.activity}>
                  {content}
                </Link>
              ) : (
                <div className={styles.activity}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}
