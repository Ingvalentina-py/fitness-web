import { Pencil } from 'lucide-react'
import { Link } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import { cx } from '../../lib/cx.js'
import { getTodayDayOfWeek, orderByWeekStart } from '../../lib/days.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useCurrentUser } from '../auth/useAuth.js'
import PlanItemChip from './PlanItemChip.jsx'
import { useWeeklyPlan } from './useWeeklyPlan.js'
import styles from './WeeklyPlanCard.module.css'

// Resumen de la semana en la pantalla Rutinas
export default function WeeklyPlanCard() {
  const { data: user } = useCurrentUser()
  const { data: plan, isPending, isError } = useWeeklyPlan()
  const labels = useMetaLabels()
  const today = getTodayDayOfWeek(user.preferences.timezone)

  return (
    <GlassCard aria-labelledby="weekly-plan-title">
      <div className={styles.header}>
        <h2 id="weekly-plan-title" className={styles.title}>
          Plan semanal
        </h2>
        <Button as={Link} to="/rutinas/plan" variant="ghost" size="sm" icon={Pencil}>
          Editar
        </Button>
      </div>

      {isPending && <p className={styles.muted}>Cargando tu plan…</p>}
      {isError && <Alert>No pudimos cargar tu plan semanal.</Alert>}

      {plan && (
        <>
          {plan.warnings.map((warning) => (
            <Alert key={warning.dayOfWeek} variant="warning">
              {warning.message}
            </Alert>
          ))}

          <ul className={styles.days}>
            {orderByWeekStart(plan.days, user.preferences.weekStartsOn).map((day) => (
              <li key={day.dayOfWeek} className={cx(styles.day, day.dayOfWeek === today && styles.today)}>
                <span className={styles.dayName}>
                  {labels.day(day.dayOfWeek)}
                  {day.dayOfWeek === today && <Badge>Hoy</Badge>}
                </span>
                <span className={styles.items}>
                  {day.items.length === 0 ? (
                    <span className={styles.muted}>Descanso</span>
                  ) : (
                    day.items.map((item, index) => <PlanItemChip key={index} item={item} />)
                  )}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </GlassCard>
  )
}
