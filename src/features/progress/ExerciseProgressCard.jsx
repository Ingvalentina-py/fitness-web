import { useState } from 'react'
import Field from '../../components/Field.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import ChartTable from '../../components/charts/ChartTable.jsx'
import LineChart from '../../components/charts/LineChart.jsx'
import { formatDayShort } from '../../lib/calendar.js'
import { formatNumber, plural } from '../../lib/format.js'
import { useExerciseProgress, useExercisesWithHistory } from './useProgress.js'
import styles from './ExerciseProgressCard.module.css'

// Peso máximo y volumen de un ejercicio a lo largo del tiempo.
// Son dos gráficas y no una con dos ejes: dos escalas distintas en un mismo eje
// hacen que cualquier cruce parezca significativo cuando no lo es.
export default function ExerciseProgressCard({ range }) {
  const exercises = useExercisesWithHistory()
  const [selected, setSelected] = useState('')

  const options = exercises.data ?? []
  const exerciseId = selected || options[0]?.exercise || ''
  const progress = useExerciseProgress(exerciseId, range)
  const points = progress.data ?? []

  return (
    <GlassCard aria-labelledby="exercise-progress-title">
      <h2 id="exercise-progress-title" className={styles.sectionTitle}>
        Progreso por ejercicio
      </h2>

      {exercises.isPending && <p className={styles.message}>Buscando tus ejercicios…</p>}

      {exercises.isSuccess && options.length === 0 && (
        <p className={styles.message}>
          Cuando registres sesiones de gimnasio, aquí verás cómo sube cada ejercicio.
        </p>
      )}

      {options.length > 0 && (
        <>
          <Field
            as="select"
            label="Ejercicio"
            value={exerciseId}
            onChange={(event) => setSelected(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.exercise} value={option.exercise}>
                {option.name} ({plural(option.sessions, 'sesión', 'sesiones')})
              </option>
            ))}
          </Field>

          {points.length === 0 ? (
            <p className={styles.message}>No hiciste este ejercicio en el periodo elegido.</p>
          ) : (
            <div className={styles.charts}>
              <section aria-labelledby="max-weight-title">
                <h3 id="max-weight-title" className={styles.chartTitle}>
                  Peso máximo (kg)
                </h3>
                <LineChart
                  data={points.map((point) => ({
                    key: point.day,
                    label: formatDayShort(point.day),
                    value: point.maxWeightKg ?? 0,
                  }))}
                  unit=" kg"
                  formatValue={(value) => formatNumber(value)}
                />
              </section>

              <section aria-labelledby="volume-title">
                <h3 id="volume-title" className={styles.chartTitle}>
                  Volumen (kg)
                </h3>
                <LineChart
                  data={points.map((point) => ({
                    key: point.day,
                    label: formatDayShort(point.day),
                    value: point.volumeKg,
                  }))}
                  unit=" kg"
                  formatValue={(value) => formatNumber(value, 0)}
                />
              </section>

              <ChartTable
                caption="Peso máximo y volumen por día"
                columns={['Día', 'Peso máx. (kg)', 'Volumen (kg)', 'Series']}
                rows={points.map((point) => [
                  formatDayShort(point.day),
                  formatNumber(point.maxWeightKg ?? 0),
                  formatNumber(point.volumeKg, 0),
                  point.sets,
                ])}
              />
            </div>
          )}
        </>
      )}
    </GlassCard>
  )
}
