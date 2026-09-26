import { ChevronLeft, ChevronRight } from 'lucide-react'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import { cx } from '../../lib/cx.js'
import { plural } from '../../lib/format.js'
import { buildMonthWeeks, formatDayName, formatMonthName, weekdayInitials } from '../../lib/calendar.js'
import { activityLook } from '../activities/activityLook.js'
import styles from './MonthCalendar.module.css'

// Cuántos puntos de color caben en una casilla antes de resumir con un "+"
const MAX_DOTS = 3

// Calendario del mes con los días marcados por el color de cada actividad.
// `activitiesByDay` es un Map de "AAAA-MM-DD" a la lista de ese día.
export default function MonthCalendar({
  year,
  month,
  weekStartsOn,
  activitiesByDay,
  selectedDay,
  today,
  onSelect,
  onChangeMonth,
}) {
  const weeks = buildMonthWeeks(year, month, weekStartsOn)
  const initials = weekdayInitials(weekStartsOn)
  const monthName = formatMonthName(year, month)

  return (
    <GlassCard aria-labelledby="calendar-title">
      <header className={styles.header}>
        <IconButton
          icon={ChevronLeft}
          label="Mes anterior"
          variant="tinted"
          onClick={() => onChangeMonth(-1)}
        />
        <h2 id="calendar-title" className={styles.month} aria-live="polite">
          {monthName}
        </h2>
        <IconButton
          icon={ChevronRight}
          label="Mes siguiente"
          variant="tinted"
          onClick={() => onChangeMonth(1)}
        />
      </header>

      <table className={styles.calendar}>
        <caption className="visually-hidden">Días de {monthName} con lo que registraste</caption>
        <thead>
          <tr>
            {initials.map((initial, index) => (
              <th key={index} scope="col" className={styles.weekday}>
                {initial}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map((day, position) =>
                day ? (
                  <td key={day} className={styles.cell}>
                    <DayButton
                      day={day}
                      activities={activitiesByDay.get(day) ?? []}
                      isSelected={day === selectedDay}
                      isToday={day === today}
                      onSelect={onSelect}
                    />
                  </td>
                ) : (
                  <td key={`empty-${index}-${position}`} className={styles.cell} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  )
}

function DayButton({ day, activities, isSelected, isToday, onSelect }) {
  const number = Number(day.slice(-2))
  const dots = activities.slice(0, MAX_DOTS)

  return (
    <button
      type="button"
      className={cx(styles.day, isSelected && styles.selected, isToday && styles.today)}
      aria-pressed={isSelected}
      aria-label={`${formatDayName(day)}: ${
        activities.length > 0 ? plural(activities.length, 'registro', 'registros') : 'sin registros'
      }`}
      onClick={() => onSelect(day)}
    >
      <span className={`${styles.number} num`}>{number}</span>
      <span className={styles.dots} aria-hidden="true">
        {dots.map((activity) => (
          <span
            key={activity._id}
            className={styles.dot}
            style={{ '--tone': activityLook(activity).color }}
          />
        ))}
        {activities.length > MAX_DOTS && <span className={styles.more}>+</span>}
      </span>
    </button>
  )
}
