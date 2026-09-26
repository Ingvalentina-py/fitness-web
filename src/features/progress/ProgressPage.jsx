import { Flame, Timer, TrendingUp, Trophy } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import BarList from '../../components/charts/BarList.jsx'
import ChartTable from '../../components/charts/ChartTable.jsx'
import ColumnChart from '../../components/charts/ColumnChart.jsx'
import { formatDayShort, shiftDay, startOfWeek, todayDayString } from '../../lib/calendar.js'
import { formatNumber, plural } from '../../lib/format.js'
import { useCurrentUser } from '../auth/useAuth.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import ExerciseProgressCard from './ExerciseProgressCard.jsx'
import RangeFilter from './RangeFilter.jsx'
import RecordsCard from './RecordsCard.jsx'
import { presetRange } from './ranges.js'
import { useDistribution, useStatsSummary } from './useProgress.js'
import styles from './ProgressPage.module.css'

// Cuántos músculos se listan antes de agrupar el resto en "Otros"
const MAX_MUSCLES = 8

export default function ProgressPage() {
  const { data: user } = useCurrentUser()
  const labels = useMetaLabels()
  const today = todayDayString(user.preferences.timezone)
  const [filter, setFilter] = useState(() => ({ preset: '90', range: presetRange('90', today) }))

  const summary = useStatsSummary(filter.range)
  const distribution = useDistribution(filter.range)

  const weeks = summary.data
    ? buildWeeks(filter.range, summary.data.activeDays, user.preferences.weekStartsOn)
    : []

  return (
    <Stagger>
      <Reveal>
        <PageHeader title="Progreso" subtitle="Lo que has construido, en números." />
      </Reveal>

      <Reveal>
        <RangeFilter
          preset={filter.preset}
          range={filter.range}
          today={today}
          onChange={setFilter}
        />
      </Reveal>

      {(summary.isError || distribution.isError) && (
        <Reveal>
          <Alert>No pudimos cargar tus estadísticas. Recarga la página.</Alert>
        </Reveal>
      )}

      {summary.isPending ? (
        <Reveal>
          <GlassCard>Calculando tus números…</GlassCard>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <GlassCard aria-labelledby="streak-title">
              <h2 id="streak-title" className={styles.sectionTitle}>
                Tu racha
              </h2>

              {/* El número que encabeza la pantalla: los días seguidos que llevas */}
              <p className={styles.heroLabel}>Días seguidos en movimiento</p>
              <p className={styles.hero}>
                <Flame className={styles.heroIcon} size={40} strokeWidth={2.25} aria-hidden="true" />
                {summary.data.streak.current}
              </p>
              <p className={styles.heroNote}>
                {summary.data.streak.current === 0
                  ? 'Hoy es un buen día para empezar otra.'
                  : `Tu mejor racha son ${plural(summary.data.streak.best, 'día', 'días')}.`}
              </p>

              <dl className={styles.stats}>
                <Stat
                  icon={TrendingUp}
                  tone="var(--color-fuchsia)"
                  label="Días activos"
                  value={summary.data.activeDays.length}
                />
                <Stat
                  icon={Timer}
                  tone="var(--color-turquoise)"
                  label="Minutos"
                  value={formatNumber(summary.data.totals.minutes, 0)}
                />
                <Stat
                  icon={Trophy}
                  tone="var(--color-yellow)"
                  label="Volumen (kg)"
                  value={formatNumber(summary.data.totals.volumeKg, 0)}
                />
              </dl>
            </GlassCard>
          </Reveal>

          <Reveal>
            <GlassCard aria-labelledby="weeks-title">
              <h2 id="weeks-title" className={styles.sectionTitle}>
                Días activos por semana
              </h2>
              <ColumnChart data={weeks} maxValue={7} bestLabel="tu mejor semana" />
              <ChartTable
                caption="Días activos de cada semana"
                columns={['Semana', 'Días activos']}
                rows={weeks.map((week) => [week.title, week.value])}
              />
            </GlassCard>
          </Reveal>
        </>
      )}

      {distribution.data && (
        <>
          <Reveal>
            <GlassCard aria-labelledby="by-activity-title">
              <h2 id="by-activity-title" className={styles.sectionTitle}>
                En qué te moviste
              </h2>
              <BarList
                items={[...distribution.data.byActivity]
                  // Ordenadas por lo que muestra la barra, no por el número de veces
                  .sort((a, b) => b.minutes - a.minutes)
                  .map((item) => ({
                    key: item.key,
                    name: item.name,
                    value: item.minutes,
                    display: `${formatNumber(item.minutes, 0)} min`,
                    color: item.color ?? 'var(--activity-gym)',
                  }))}
                emptyMessage="Aún no has registrado nada en este periodo."
              />
              <ChartTable
                caption="Minutos por tipo de actividad"
                columns={['Actividad', 'Veces', 'Minutos']}
                rows={distribution.data.byActivity.map((item) => [item.name, item.count, item.minutes])}
              />
            </GlassCard>
          </Reveal>

          <Reveal>
            <GlassCard aria-labelledby="by-muscle-title">
              <h2 id="by-muscle-title" className={styles.sectionTitle}>
                Músculos que trabajaste
              </h2>
              <p className={styles.note}>
                Series completadas en el gimnasio. Una serie cuenta para cada músculo
                principal del ejercicio.
              </p>
              <BarList
                items={topMuscles(distribution.data.byMuscle, labels)}
                emptyMessage="Todavía no hay series de gimnasio en este periodo."
              />
              <ChartTable
                caption="Series por músculo"
                columns={['Músculo', 'Series']}
                rows={distribution.data.byMuscle.map((item) => [labels.muscle(item.muscle), item.sets])}
              />
            </GlassCard>
          </Reveal>
        </>
      )}

      <Reveal>
        <ExerciseProgressCard range={filter.range} />
      </Reveal>

      <Reveal>
        <RecordsCard />
      </Reveal>
    </Stagger>
  )
}

function Stat({ icon: Icon, tone, label, value }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>
        <span className={styles.statIcon} style={{ '--tone': tone }} aria-hidden="true">
          <Icon size={16} strokeWidth={2.5} />
        </span>
        {label}
      </dt>
      <dd className={`${styles.statValue} num`}>{value}</dd>
    </div>
  )
}

// Semanas del rango con cuántos días activos tuvo cada una (0 a 7)
function buildWeeks({ from, to }, activeDays, weekStartsOn) {
  const active = new Set(activeDays)
  const weeks = []

  for (let week = startOfWeek(from, weekStartsOn); week <= to; week = shiftDay(week, 7)) {
    const days = Array.from({ length: 7 }, (_, index) => shiftDay(week, index))
    weeks.push({
      key: week,
      label: formatDayShort(week),
      title: `semana del ${formatDayShort(week)}`,
      value: days.filter((day) => day >= from && day <= to && active.has(day)).length,
    })
  }

  return weeks
}

// Los músculos más trabajados; el resto se resume para no llenar la pantalla de barras
function topMuscles(byMuscle, labels) {
  const top = byMuscle.slice(0, MAX_MUSCLES).map((item) => ({
    key: item.muscle,
    name: labels.muscle(item.muscle),
    value: item.sets,
    display: plural(item.sets, 'serie', 'series'),
  }))

  const rest = byMuscle.slice(MAX_MUSCLES).reduce((total, item) => total + item.sets, 0)
  if (rest > 0) {
    top.push({ key: 'otros', name: 'Otros músculos', value: rest, display: plural(rest, 'serie', 'series') })
  }

  return top
}
