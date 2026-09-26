import { CalendarDays, ChevronRight, Moon, Play } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconByName from '../../components/IconByName.jsx'
import { getIcon } from '../../components/icons.js'
import { getTodayDayOfWeek } from '../../lib/days.js'
import { plural } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useWeeklyPlan } from '../routines/useWeeklyPlan.js'
import StartSessionSheet from '../sessions/StartSessionSheet.jsx'
import styles from './TodayPlan.module.css'

// "Planeado para hoy" según el plan semanal y la zona horaria de la persona
export default function TodayPlan({ timeZone }) {
  const { data: plan, isPending, isError } = useWeeklyPlan()
  const labels = useMetaLabels()
  const [isStartOpen, setIsStartOpen] = useState(false)

  if (isPending) return <GlassCard>Cargando tu plan de hoy…</GlassCard>
  if (isError) return <Alert>No pudimos cargar tu plan de hoy.</Alert>

  const today = getTodayDayOfWeek(timeZone)
  const items = plan.days[today].items
  const warning = plan.warnings.find((item) => item.dayOfWeek === today)
  const hasAnyPlan = plan.days.some((day) => day.items.length > 0)

  if (items.length === 0) {
    return hasAnyPlan ? (
      <EmptyState
        icon={Moon}
        color="turquoise"
        title="Hoy toca descanso"
        description="Tu cuerpo también progresa descansando. Si te provoca moverte, registra una actividad libre."
        action={
          <Button as={Link} to="/rutinas/plan" variant="secondary">
            Ver plan semanal
          </Button>
        }
      />
    ) : (
      <EmptyState
        icon={CalendarDays}
        color="turquoise"
        title="Aún no hay nada planeado para hoy"
        description="Arma tu plan semanal en Rutinas y aquí verás qué te toca cada día."
        action={
          <Button as={Link} to="/rutinas" variant="secondary">
            Ir a Rutinas
          </Button>
        }
      />
    )
  }

  const plannedRoutines = items.filter((item) => item.kind === 'routine').map((item) => item.routine)

  return (
    <GlassCard aria-labelledby="today-plan-title">
      <h2 id="today-plan-title" className={styles.title}>
        Planeado para hoy
      </h2>

      {warning && <Alert variant="warning">{warning.message}</Alert>}

      <ul className={styles.list}>
        {items.map((item, index) =>
          item.kind === 'routine' ? (
            <li key={index} className={styles.routine}>
              <RoutineIcon group={item.routine.group} />
              <Link to={`/rutinas/${item.routine._id}`} className={styles.routineText}>
                <span className={styles.routineName}>{item.routine.name}</span>
                <span className={styles.muted}>
                  {labels.goal(item.routine.goal)} ·{' '}
                  {plural(item.routine.exerciseCount, 'ejercicio', 'ejercicios')}
                </span>
              </Link>
              <ChevronRight size={20} aria-hidden="true" />
            </li>
          ) : (
            <li key={index}>
              <Chip icon={getIcon(item.activityType.icon)} color={item.activityType.color}>
                {item.activityType.name}
              </Chip>
            </li>
          ),
        )}
      </ul>

      {/* Con una sola rutina planeada se empieza de una; con varias, se elige cuál */}
      {plannedRoutines.length === 1 ? (
        <Button as={Link} to={`/sesion?rutina=${plannedRoutines[0]._id}`} icon={Play} size="lg">
          Empezar {plannedRoutines[0].name}
        </Button>
      ) : (
        plannedRoutines.length > 1 && (
          <Button icon={Play} size="lg" onClick={() => setIsStartOpen(true)}>
            Empezar rutina
          </Button>
        )
      )}

      {isStartOpen && <StartSessionSheet onClose={() => setIsStartOpen(false)} />}
    </GlassCard>
  )
}

function RoutineIcon({ group }) {
  return (
    <span
      className={styles.icon}
      style={{ '--tone': group?.color ?? 'var(--color-fuchsia)' }}
      aria-hidden="true"
    >
      <IconByName name={group?.icon} size={22} strokeWidth={2.25} />
    </span>
  )
}
