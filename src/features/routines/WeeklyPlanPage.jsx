import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import BackLink from '../../components/BackLink.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { getTodayDayOfWeek, orderByWeekStart } from '../../lib/days.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useCurrentUser } from '../auth/useAuth.js'
import PlanItemChip from './PlanItemChip.jsx'
import PlanItemPickerSheet from './PlanItemPickerSheet.jsx'
import { useUpdateWeeklyPlan, useWeeklyPlan } from './useWeeklyPlan.js'
import styles from './WeeklyPlanPage.module.css'

const MAX_ITEMS_PER_DAY = 6

// Cada cambio se guarda al instante; la API devuelve el plan con los avisos recalculados
export default function WeeklyPlanPage() {
  const { data: user } = useCurrentUser()
  const planQuery = useWeeklyPlan()
  const updatePlan = useUpdateWeeklyPlan()
  const labels = useMetaLabels()
  const [pickerDay, setPickerDay] = useState(null)

  const plan = planQuery.data
  const today = getTodayDayOfWeek(user.preferences.timezone)

  function saveDay(dayOfWeek, items) {
    updatePlan.mutate(plan.days.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, items } : day)))
  }

  const itemName = (item) => item.routine?.name ?? item.activityType.name

  return (
    <Stagger>
      <Reveal>
        <BackLink to="/rutinas">Rutinas</BackLink>
        <PageHeader
          title="Plan semanal"
          subtitle="Asigna rutinas o actividades a cada día. Lo que planees aparecerá en Hoy."
        />
      </Reveal>

      <Reveal>
        <p className={styles.status} aria-live="polite">
          {updatePlan.isPending && 'Guardando…'}
          {updatePlan.isSuccess && !updatePlan.isPending && 'Cambios guardados'}
        </p>
        {updatePlan.isError && <Alert>No pudimos guardar el cambio: {updatePlan.error.message}</Alert>}
      </Reveal>

      {planQuery.isPending && (
        <Reveal>
          <GlassCard>Cargando tu plan…</GlassCard>
        </Reveal>
      )}
      {planQuery.isError && (
        <Reveal>
          <Alert>No pudimos cargar tu plan semanal.</Alert>
        </Reveal>
      )}

      {plan &&
        orderByWeekStart(plan.days, user.preferences.weekStartsOn).map((day) => {
          const dayName = labels.day(day.dayOfWeek)
          const warning = plan.warnings?.find((item) => item.dayOfWeek === day.dayOfWeek)

          return (
            <Reveal key={day.dayOfWeek}>
              <GlassCard aria-labelledby={`plan-day-${day.dayOfWeek}`}>
                <div className={styles.dayHeader}>
                  <h2 id={`plan-day-${day.dayOfWeek}`} className={styles.dayName}>
                    {dayName}
                  </h2>
                  {day.dayOfWeek === today && <Badge>Hoy</Badge>}
                </div>

                {warning && <Alert variant="warning">{warning.message}</Alert>}

                {day.items.length === 0 ? (
                  <p className={styles.rest}>Descanso</p>
                ) : (
                  <ul className={styles.items}>
                    {day.items.map((item, index) => (
                      <li key={`${item.kind}-${index}`} className={styles.item}>
                        <PlanItemChip item={item} />
                        <IconButton
                          icon={X}
                          size="sm"
                          label={`Quitar ${itemName(item)} del ${dayName.toLowerCase()}`}
                          onClick={() =>
                            saveDay(day.dayOfWeek, day.items.filter((_, itemIndex) => itemIndex !== index))
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={() => setPickerDay(day.dayOfWeek)}
                  disabled={day.items.length >= MAX_ITEMS_PER_DAY}
                >
                  Agregar
                </Button>
              </GlassCard>
            </Reveal>
          )
        })}

      {pickerDay !== null && (
        <PlanItemPickerSheet
          title={`Agregar al ${labels.day(pickerDay).toLowerCase()}`}
          onClose={() => setPickerDay(null)}
          onSelect={(item) => {
            const day = plan.days[pickerDay]
            saveDay(pickerDay, [...day.items, item])
            setPickerDay(null)
          }}
        />
      )}
    </Stagger>
  )
}
