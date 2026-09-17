import Badge from '../../components/Badge.jsx'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import styles from './ExerciseSummary.module.css'

// Nombre del ejercicio con su equipo y músculos principales
export default function ExerciseSummary({ exercise }) {
  const labels = useMetaLabels()
  const details = [
    labels.equipment(exercise.equipment),
    exercise.primaryMuscles.map(labels.muscle).join(', '),
    exercise.isUnilateral && 'Unilateral',
  ].filter(Boolean)

  return (
    <span className={styles.summary}>
      <span className={styles.name}>
        {exercise.name}
        {exercise.owner && <Badge>Tuyo</Badge>}
      </span>
      <span className={styles.details}>{details.join(' · ')}</span>
    </span>
  )
}
