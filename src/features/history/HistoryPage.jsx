import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Alert from '../../components/Alert.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { monthRange, toDayString, todayDayString } from '../../lib/calendar.js'
import { plural } from '../../lib/format.js'
import { useCurrentUser } from '../auth/useAuth.js'
import { useActivitiesInRange } from '../activities/useActivities.js'
import DayDetail from './DayDetail.jsx'
import MonthCalendar from './MonthCalendar.jsx'
import styles from './HistoryPage.module.css'

// /historial — calendario del mes y detalle del día elegido (?dia=AAAA-MM-DD)
export default function HistoryPage() {
  const { data: user } = useCurrentUser()
  const [searchParams, setSearchParams] = useSearchParams()

  const today = todayDayString(user.preferences.timezone)
  const selectedDay = searchParams.get('dia') ?? today
  // El mes que se ve arranca en el del día elegido y se mueve con las flechas
  const [visibleMonth, setVisibleMonth] = useState(() => ({
    year: Number(selectedDay.slice(0, 4)),
    month: Number(selectedDay.slice(5, 7)) - 1,
  }))

  const range = monthRange(visibleMonth.year, visibleMonth.month)
  const { data: activities, isPending, isError } = useActivitiesInRange(range)

  // Las actividades del mes, agrupadas por día para el calendario
  const activitiesByDay = new Map()
  for (const activity of activities ?? []) {
    activitiesByDay.set(activity.day, [...(activitiesByDay.get(activity.day) ?? []), activity])
  }

  // El día elegido vive en la URL: así se puede volver a él y compartirlo
  function selectDay(day) {
    setSearchParams(day === today ? {} : { dia: day }, { replace: true })
  }

  function changeMonth(step) {
    const date = new Date(Date.UTC(visibleMonth.year, visibleMonth.month + step, 1))
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    setVisibleMonth({ year, month })

    // El detalle acompaña al mes: si es el mes de hoy se queda en hoy, si no, en el día 1
    const firstDay = toDayString(year, month, 1)
    selectDay(today.slice(0, 7) === firstDay.slice(0, 7) ? today : firstDay)
  }

  const monthCount = activities?.length ?? 0

  return (
    <Stagger>
      <Reveal>
        <PageHeader
          title="Historial"
          subtitle="Tu calendario y el detalle de cada día."
          eyebrow={
            isPending ? 'Cargando…' : plural(monthCount, 'registro este mes', 'registros este mes')
          }
        />
      </Reveal>

      {isError && (
        <Reveal>
          <Alert>No pudimos cargar tu historial. Recarga la página.</Alert>
        </Reveal>
      )}

      <Reveal>
        <MonthCalendar
          year={visibleMonth.year}
          month={visibleMonth.month}
          weekStartsOn={user.preferences.weekStartsOn}
          activitiesByDay={activitiesByDay}
          selectedDay={selectedDay}
          today={today}
          onSelect={selectDay}
          onChangeMonth={changeMonth}
        />
      </Reveal>

      <Reveal>
        {isPending ? (
          <GlassCard className={styles.loading}>Cargando lo que registraste…</GlassCard>
        ) : (
          <DayDetail day={selectedDay} activities={activitiesByDay.get(selectedDay) ?? []} />
        )}
      </Reveal>
    </Stagger>
  )
}
