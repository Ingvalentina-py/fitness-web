import { Plus, Save } from 'lucide-react'
import { useRef, useState } from 'react'
import { useBlocker, useNavigate, useParams } from 'react-router'
import Alert from '../../components/Alert.jsx'
import BackLink from '../../components/BackLink.jsx'
import Button from '../../components/Button.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import Field from '../../components/Field.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { formatNumber } from '../../lib/format.js'
import ExercisePickerSheet from '../exercises/ExercisePickerSheet.jsx'
import SessionExerciseCard from './SessionExerciseCard.jsx'
import { newDraftExercise, newDraftSet } from './sessionDraft.js'
import { draftStats } from './sessionStats.js'
import { useSession, useUpdateSession } from './useSessions.js'
import styles from './SessionEditPage.module.css'

// /sesion/:sessionId/editar — corregir una sesión ya guardada, series incluidas.
// No usa el borrador del navegador: esto no es una sesión en curso, es una corrección.
export default function SessionEditPage() {
  const { sessionId } = useParams()
  const { data: session, isPending, isError } = useSession(sessionId)

  if (isPending) return <GlassCard>Cargando la sesión…</GlassCard>
  if (isError) return <Alert>No pudimos cargar esta sesión.</Alert>

  return <SessionForm session={session} />
}

// Un ejercicio guardado se convierte al formato que espera SessionExerciseCard.
// El nombre y los músculos son la copia que guardó la sesión, no el catálogo de hoy.
function toFormExercise(performed, index) {
  return {
    key: `exercise-${index}`,
    exercise: {
      _id: performed.exercise,
      name: performed.name,
      equipment: performed.equipment,
      primaryMuscles: performed.primaryMuscles,
      secondaryMuscles: performed.secondaryMuscles,
      isUnilateral: performed.isUnilateral,
    },
    isUnilateral: performed.isUnilateral,
    restSeconds: performed.restSeconds ?? 60,
    targetReps: null,
    notes: performed.notes ?? '',
    sets: performed.sets.map((set, position) => ({
      key: `exercise-${index}-set-${position}`,
      reps: set.reps ?? '',
      weight: set.weight ?? '',
      unit: set.unit,
      completed: set.completed,
    })),
  }
}

function SessionForm({ session }) {
  const navigate = useNavigate()
  const updateSession = useUpdateSession()
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [form, setForm] = useState(() => ({
    day: session.day,
    durationMinutes: String(session.durationMinutes ?? ''),
    energy: session.energy ?? '',
    notes: session.notes ?? '',
    exercises: session.exercises.map(toFormExercise),
  }))

  const stats = draftStats(form)
  const fieldErrors = getFieldErrors(updateSession.error)
  const backTo = `/historial?dia=${session.day}`

  // Salir con cambios sin guardar pide confirmación, igual que en el editor de rutinas.
  // El aviso se apaga con una referencia y no con el estado de la mutación: al guardar,
  // la navegación ocurre antes de que el componente se vuelva a dibujar.
  const hasSavedRef = useRef(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !hasSavedRef.current && currentLocation.pathname !== nextLocation.pathname,
  )

  function change(changes) {
    setForm((current) => ({ ...current, ...changes }))
    setIsDirty(true)
  }

  function changeExercise(key, changes) {
    change({
      exercises: form.exercises.map((item) => (item.key === key ? { ...item, ...changes } : item)),
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    updateSession.mutate(
      {
        id: session._id,
        // Solo se reenvía el día si cambió, para no mover la hora original
        ...(form.day !== session.day && { date: `${form.day}T12:00:00` }),
        ...(form.durationMinutes !== '' && { durationMinutes: Number(form.durationMinutes) }),
        ...(form.energy !== '' && { energy: Number(form.energy) }),
        ...(form.notes.trim() && { notes: form.notes.trim() }),
        exercises: form.exercises.map((item) => ({
          exercise: item.exercise._id,
          isUnilateral: item.isUnilateral,
          restSeconds: item.restSeconds,
          ...(item.notes.trim() && { notes: item.notes.trim() }),
          sets: item.sets
            .filter((set) => set.completed)
            .map((set) => ({
              ...(set.reps !== '' && { reps: Number(set.reps) }),
              ...(set.weight !== '' && { weight: Number(set.weight) }),
              unit: set.unit,
              completed: true,
            })),
        })),
      },
      {
        onSuccess: () => {
          hasSavedRef.current = true
          navigate(backTo)
        },
      },
    )
  }

  return (
    <Stagger>
      <Reveal>
        <BackLink to={backTo}>Historial</BackLink>
        <PageHeader
          documentTitle="Corregir sesión"
          eyebrow={session.routine?.name ?? 'Sesión libre'}
          title="Corregir sesión"
          subtitle="Cambia lo que quedó mal: tu volumen y tus récords se recalculan solos."
        />
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="session-data-title">
          <h2 id="session-data-title" className={styles.sectionTitle}>
            Datos de la sesión
          </h2>

          {updateSession.isError && (
            <Alert>{fieldErrors[''] ?? fieldErrors.exercises ?? updateSession.error.message}</Alert>
          )}

          <form id="session-form" className={styles.form} onSubmit={handleSubmit}>
            <Field
              label="Día"
              type="date"
              value={form.day}
              onChange={(event) => change({ day: event.target.value })}
              error={fieldErrors.date}
            />
            <Field
              label="Duración (minutos)"
              type="number"
              inputMode="numeric"
              min={0}
              max={1440}
              value={form.durationMinutes}
              onChange={(event) => change({ durationMinutes: event.target.value })}
              error={fieldErrors.durationMinutes}
            />
            <Field
              as="select"
              label="Energía"
              value={form.energy}
              onChange={(event) => change({ energy: event.target.value })}
            >
              <option value="">Sin anotar</option>
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {level} de 5
                </option>
              ))}
            </Field>
            <Field
              as="textarea"
              label="Notas"
              rows={2}
              maxLength={1000}
              value={form.notes}
              onChange={(event) => change({ notes: event.target.value })}
            />
          </form>

          <p className={`${styles.volume} num`}>
            Volumen con lo que llevas marcado: <strong>{formatNumber(stats.volumeKg)} kg</strong> ·{' '}
            {stats.completedSets}/{stats.totalSets} series
          </p>
        </GlassCard>
      </Reveal>

      {form.exercises.map((item, index) => (
        <Reveal key={item.key}>
          <SessionExerciseCard
            item={item}
            index={index}
            showPrevious={false}
            onChange={(changes) => changeExercise(item.key, changes)}
            onRemove={() =>
              change({ exercises: form.exercises.filter((current) => current.key !== item.key) })
            }
            // Al corregir no hay descanso que contar
            onSetCompleted={() => {}}
          />
        </Reveal>
      ))}

      <Reveal>
        <Button variant="secondary" icon={Plus} fullWidth onClick={() => setIsPickerOpen(true)}>
          Agregar ejercicio
        </Button>
      </Reveal>

      <div className={styles.saveBar}>
        <Button
          type="submit"
          form="session-form"
          size="lg"
          fullWidth
          icon={Save}
          disabled={updateSession.isPending || stats.completedSets === 0}
        >
          {updateSession.isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        {stats.completedSets === 0 && (
          <p className={styles.hint}>Deja al menos una serie marcada como hecha.</p>
        )}
      </div>

      {isPickerOpen && (
        <ExercisePickerSheet
          onClose={() => setIsPickerOpen(false)}
          onAdd={(exercises) => {
            const unit = form.exercises[0]?.sets[0]?.unit ?? 'kg'
            change({
              exercises: [
                ...form.exercises,
                ...exercises.map((exercise) => ({
                  ...newDraftExercise({ exercise, targetSets: 1 }, unit),
                  // Una serie ya marcada: al corregir se agrega lo que sí se hizo
                  sets: [{ ...newDraftSet(unit), completed: true }],
                })),
              ],
            })
            setIsPickerOpen(false)
          }}
        />
      )}

      {blocker.state === 'blocked' && (
        <ConfirmSheet
          title="¿Salir sin guardar?"
          description="Perderás las correcciones que hiciste en esta sesión."
          confirmLabel="Salir sin guardar"
          danger
          onClose={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        />
      )}
    </Stagger>
  )
}
