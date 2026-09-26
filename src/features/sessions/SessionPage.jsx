import { Dumbbell, Flag, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useBlocker, useNavigate, useSearchParams } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { formatClock, formatNumber, plural } from '../../lib/format.js'
import { useCurrentUser } from '../auth/useAuth.js'
import ExercisePickerSheet from '../exercises/ExercisePickerSheet.jsx'
import { useRoutine } from '../routines/useRoutines.js'
import FinishSessionSheet from './FinishSessionSheet.jsx'
import RestTimer from './RestTimer.jsx'
import SessionExerciseCard from './SessionExerciseCard.jsx'
import StartSessionSheet from './StartSessionSheet.jsx'
import { clearDraft, newDraftExercise, startDraft, updateDraft, useSessionDraft } from './sessionDraft.js'
import { draftStats } from './sessionStats.js'
import { useElapsedSeconds } from './useElapsed.js'
import { useLastPerformances } from './useSessions.js'
import styles from './SessionPage.module.css'

// /sesion — la sesión en curso. Vive en el navegador hasta que pulsas "Terminar sesión".
// Se llega con ?rutina=<id> (desde una rutina guardada) o ?nueva=1 (desde cero).
export default function SessionPage() {
  const { data: user } = useCurrentUser()
  const draft = useSessionDraft()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const routineId = searchParams.get('rutina')
  const wantsNew = searchParams.get('nueva') === '1'
  const routineQuery = useRoutine(routineId)

  const defaultUnit = user.preferences.weightUnit
  const isStarting = Boolean(routineId) || wantsNew
  // Hay una sesión a medias y se pidió empezar otra distinta: hay que preguntar
  const hasConflict = Boolean(draft) && isStarting && draft.routine?._id !== routineId

  // La rutina pedida en la URL, ya cargada; null si la sesión empieza desde cero
  const routineToStart = wantsNew ? null : routineQuery.data
  const canStart = isStarting && !hasConflict && (wantsNew || Boolean(routineQuery.data))

  useEffect(() => {
    if (!canStart) return
    // La sesión pedida ya está abierta: solo se limpia la URL
    if (draft) {
      navigate('/sesion', { replace: true })
      return
    }
    startDraft({
      userId: user._id,
      routine: routineToStart,
      exercises: routineToStart?.exercises ?? [],
      defaultUnit,
    })
    navigate('/sesion', { replace: true })
  }, [canStart, draft, navigate, routineToStart, user._id, defaultUnit])

  if (hasConflict) {
    return (
      <ConfirmSheet
        title="Ya tienes una sesión en curso"
        description="Puedes seguir con la sesión que dejaste a medias o descartarla y empezar esta."
        confirmLabel="Descartar y empezar esta"
        danger
        onClose={() => navigate('/sesion', { replace: true })}
        // Al descartar el borrador, el efecto de arriba empieza sola la sesión pedida
        onConfirm={clearDraft}
      />
    )
  }

  if (!draft) {
    if (isStarting && routineQuery.isPending) return <GlassCard>Preparando tu sesión…</GlassCard>
    if (routineQuery.isError) {
      return <Alert>No pudimos cargar esa rutina. Vuelve a Rutinas e inténtalo de nuevo.</Alert>
    }
    return <NoSession />
  }

  return <ActiveSession draft={draft} defaultUnit={defaultUnit} />
}

function NoSession() {
  const [isStartOpen, setIsStartOpen] = useState(false)

  return (
    <Stagger>
      <Reveal>
        <PageHeader documentTitle="Sesión" title="Sesión de gimnasio" />
      </Reveal>
      <Reveal>
        <EmptyState
          icon={Dumbbell}
          title="No tienes una sesión en curso"
          description="Empieza desde una rutina guardada y tendrás todos los ejercicios listos para llenar."
          action={<Button onClick={() => setIsStartOpen(true)}>Empezar sesión</Button>}
        />
      </Reveal>
      {isStartOpen && <StartSessionSheet onClose={() => setIsStartOpen(false)} />}
    </Stagger>
  )
}

function ActiveSession({ draft, defaultUnit }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isFinishOpen, setIsFinishOpen] = useState(false)
  const [isDiscardOpen, setIsDiscardOpen] = useState(false)
  // Descanso en curso: { id, name, endsAt }; `id` sube en cada descanso nuevo
  const [rest, setRest] = useState(null)

  const elapsed = useElapsedSeconds(draft.startedAt)
  const stats = draftStats(draft)
  const exerciseIds = draft.exercises.map((item) => item.exercise._id)
  const previousQuery = useLastPerformances(exerciseIds)
  const previousByExercise = new Map((previousQuery.data ?? []).map((item) => [item.exercise, item]))

  // El borrador no se pierde al cambiar de pestaña, así que solo se avisa cuando
  // todavía no hay nada registrado (salir ahí sí sería empezar de cero).
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      stats.completedSets === 0 &&
      currentLocation.pathname !== nextLocation.pathname &&
      !nextLocation.pathname.startsWith('/sesion'),
  )

  function changeExercise(key, changes) {
    updateDraft((current) => ({
      exercises: current.exercises.map((item) => (item.key === key ? { ...item, ...changes } : item)),
    }))
  }

  function removeExercise(key) {
    updateDraft((current) => ({ exercises: current.exercises.filter((item) => item.key !== key) }))
  }

  function addExercises(exercises) {
    updateDraft((current) => ({
      exercises: [
        ...current.exercises,
        ...exercises.map((exercise) => newDraftExercise({ exercise }, defaultUnit)),
      ],
    }))
    setIsPickerOpen(false)
  }

  // Al completar una serie arranca el descanso de ese ejercicio
  function startRest(item) {
    if (!item.restSeconds) return
    setRest((current) => nextRest(current, item))
  }

  return (
    <Stagger>
      <Reveal>
        <PageHeader
          documentTitle="Sesión"
          eyebrow="Sesión en curso"
          title={draft.routine?.name ?? 'Sesión libre'}
        />
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="session-stats-title">
          <h2 id="session-stats-title" className="visually-hidden">
            Cómo va tu sesión
          </h2>
          <dl className={styles.stats}>
            <Stat label="Tiempo" value={formatClock(elapsed)} />
            <Stat label="Volumen" value={`${formatNumber(stats.volumeKg)} kg`} />
            <Stat label="Series" value={`${stats.completedSets}/${stats.totalSets}`} />
          </dl>
        </GlassCard>
      </Reveal>

      {draft.exercises.map((item, index) => (
        <Reveal key={item.key}>
          <SessionExerciseCard
            item={item}
            index={index}
            previous={previousByExercise.get(item.exercise._id)}
            onChange={(changes) => changeExercise(item.key, changes)}
            onRemove={() => removeExercise(item.key)}
            onSetCompleted={() => startRest(item)}
          />
        </Reveal>
      ))}

      <Reveal>
        <Button variant="secondary" icon={Plus} fullWidth onClick={() => setIsPickerOpen(true)}>
          Agregar ejercicio
        </Button>
      </Reveal>

      <div className={styles.bottomBar}>
        {/* key: cada descanso nuevo reinicia el temporizador desde cero */}
        {rest && <RestTimer key={rest.id} rest={rest} onClose={() => setRest(null)} />}
        <Button
          size="lg"
          fullWidth
          icon={Flag}
          disabled={stats.completedSets === 0}
          onClick={() => setIsFinishOpen(true)}
        >
          {stats.completedSets === 0
            ? 'Marca una serie para terminar'
            : `Terminar sesión · ${plural(stats.completedSets, 'serie', 'series')}`}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsDiscardOpen(true)}>
          Descartar sesión
        </Button>
      </div>

      {isPickerOpen && <ExercisePickerSheet onClose={() => setIsPickerOpen(false)} onAdd={addExercises} />}

      {isFinishOpen && (
        <FinishSessionSheet
          draft={draft}
          stats={stats}
          elapsedSeconds={elapsed}
          onClose={() => setIsFinishOpen(false)}
        />
      )}

      {isDiscardOpen && (
        <ConfirmSheet
          title="¿Descartar esta sesión?"
          description="Se borra lo que llevas registrado. Esto no se puede deshacer."
          confirmLabel="Descartar sesión"
          danger
          onClose={() => setIsDiscardOpen(false)}
          onConfirm={clearDraft}
        />
      )}

      {blocker.state === 'blocked' && (
        <ConfirmSheet
          title="¿Salir de la sesión?"
          description="Todavía no has marcado ninguna serie. Puedes volver cuando quieras: la sesión sigue guardada en este dispositivo."
          confirmLabel="Salir"
          onClose={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        />
      )}
    </Stagger>
  )
}

// Descanso siguiente. Va fuera del componente porque calcula la hora actual.
function nextRest(current, item) {
  return {
    id: (current?.id ?? 0) + 1,
    name: item.exercise.name,
    endsAt: Date.now() + item.restSeconds * 1000,
  }
}

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>{label}</dt>
      <dd className={`${styles.statValue} num`}>{value}</dd>
    </div>
  )
}
