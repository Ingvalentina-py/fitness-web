import { CalendarDays, Save, Trophy, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Confetti from '../../components/Confetti.jsx'
import CountUp from '../../components/CountUp.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { formatDuration, formatNumber } from '../../lib/format.js'
import { canSpeak, speak, stopSpeaking } from '../../lib/speech.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useCurrentUser } from '../auth/useAuth.js'
import { usePhrases } from '../phrases/usePhrases.js'
import SaveAsRoutineSheet from './SaveAsRoutineSheet.jsx'
import { workedMuscles } from './sessionStats.js'
import { useSession } from './useSessions.js'
import styles from './SessionSummaryPage.module.css'

const RECORD_LABELS = { maxWeight: 'Peso máximo', bestVolume: 'Mejor volumen' }

// /sesion/:sessionId/resumen
export default function SessionSummaryPage() {
  const { sessionId } = useParams()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const { data: session, isPending, isError } = useSession(sessionId)
  const labels = useMetaLabels()
  const [isSaveOpen, setIsSaveOpen] = useState(false)

  // Los récords llegan al navegar desde la sesión; al recargar la página no están
  // (siguen estando en Progreso).
  const records = location.state?.records ?? []
  // Si superaste una marca, la frase la celebra; si no, celebra haber terminado
  const context = records.length > 0 ? 'record' : 'sessionCompleted'
  const { data: phrases } = usePhrases({ context })
  const phrase = usePickOne(phrases)

  if (isPending) return <GlassCard>Cargando tu resumen…</GlassCard>
  if (isError) return <Alert>No pudimos cargar esta sesión.</Alert>

  const muscles = workedMuscles(session.exercises)

  return (
    <Stagger>
      <Reveal>
        <PageHeader
          documentTitle="Resumen de la sesión"
          eyebrow={session.routine?.name ?? 'Sesión libre'}
          title="¡Sesión completada!"
        />
      </Reveal>

      <Reveal>
        <GlassCard className={styles.celebration} aria-labelledby="summary-volume">
          <Confetti />
          <p id="summary-volume" className={styles.volumeLabel}>
            Volumen total
          </p>
          <p className={`${styles.volume} num`}>
            <CountUp value={session.totalVolumeKg} format={(value) => formatNumber(value, 0)} />
            <span className={styles.unit}> kg</span>
          </p>
          <ClosingPhrase phrase={phrase} readAloud={user.preferences.voicePhrases} />
        </GlassCard>
      </Reveal>

      {records.length > 0 && (
        <Reveal>
          <GlassCard aria-labelledby="summary-records-title">
            <h2 id="summary-records-title" className={styles.sectionTitle}>
              Récords superados
            </h2>
            <ul className={styles.records}>
              {records.map((record) => (
                <li key={`${record.exercise}-${record.kind}`} className={styles.record}>
                  <span className={styles.recordIcon} aria-hidden="true">
                    <Trophy size={18} strokeWidth={2.5} />
                  </span>
                  <span className={styles.recordText}>
                    <span className={styles.recordName}>{record.name}</span>
                    <span className={styles.recordDetail}>
                      {RECORD_LABELS[record.kind]}: {formatNumber(record.previousKg)} →{' '}
                      <strong>{formatNumber(record.valueKg)} kg</strong>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      )}

      <Reveal>
        <GlassCard aria-labelledby="summary-stats-title">
          <h2 id="summary-stats-title" className={styles.sectionTitle}>
            Tu sesión
          </h2>
          <dl className={styles.stats}>
            <Stat label="Duración" value={formatDuration(session.durationMinutes)} />
            <Stat label="Ejercicios" value={session.exercises.length} />
            <Stat label="Series" value={countCompletedSets(session)} />
            <Stat label="Energía" value={session.energy ? `${session.energy}/5` : '—'} />
          </dl>

          {muscles.length > 0 && (
            <>
              <h3 className={styles.subtitle}>Músculos trabajados</h3>
              <ul className={styles.muscles}>
                {muscles.map((muscle) => (
                  <li key={muscle} className={styles.muscle}>
                    {labels.muscle(muscle)}
                  </li>
                ))}
              </ul>
            </>
          )}

          {session.notes && <p className={styles.notes}>{session.notes}</p>}
        </GlassCard>
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="summary-exercises-title">
          <h2 id="summary-exercises-title" className={styles.sectionTitle}>
            Lo que hiciste
          </h2>
          <ul className={styles.exercises}>
            {session.exercises.map((exercise, index) => (
              <li key={index} className={styles.exercise}>
                <p className={styles.exerciseName}>
                  {exercise.name}
                  {exercise.isUnilateral && <span className={styles.unilateral}> · Unilateral</span>}
                </p>
                <p className={`${styles.exerciseSets} num`}>
                  {exercise.sets
                    .filter((set) => set.completed)
                    .map((set) => `${set.reps ?? '—'}×${formatNumber(set.weight ?? 0)} ${set.unit}`)
                    .join(' · ')}
                </p>
                <p className={styles.exerciseVolume}>
                  {formatNumber(exercise.volumeKg)} kg de volumen
                  {exercise.isUnilateral && ' (contando los dos lados)'}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal>
        <div className={styles.actions}>
          <Button icon={Save} fullWidth onClick={() => setIsSaveOpen(true)}>
            {session.routine ? 'Guardar como rutina' : 'Guardar esta sesión como rutina'}
          </Button>
          <Button as={Link} to="/" variant="ghost" icon={CalendarDays} fullWidth>
            Volver a Hoy
          </Button>
        </div>
      </Reveal>

      {isSaveOpen && <SaveAsRoutineSheet session={session} onClose={() => setIsSaveOpen(false)} />}
    </Stagger>
  )
}

// Una frase al azar de las que aplican, elegida una sola vez por visita
function usePickOne(phrases) {
  const [seed] = useState(() => Math.random())
  if (!phrases?.length) return null
  return phrases[Math.floor(seed * phrases.length)]
}

// La frase del cierre. Si tienes la voz activada en tu perfil, se lee sola al llegar;
// el botón sirve para repetirla (y para escucharla aunque la tengas desactivada).
function ClosingPhrase({ phrase, readAloud }) {
  useEffect(() => {
    if (!phrase || !readAloud) return

    speak(phrase.text)
    // Si sales de la pantalla a mitad de frase, se calla
    return stopSpeaking
  }, [phrase, readAloud])

  if (!phrase) return null

  return (
    <p className={styles.phrase}>
      {phrase.text}
      {canSpeak() && (
        <IconButton
          icon={Volume2}
          label="Escuchar la frase"
          size="sm"
          onClick={() => speak(phrase.text)}
        />
      )}
    </p>
  )
}

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>{label}</dt>
      <dd className={`${styles.statValue} num`}>{value}</dd>
    </div>
  )
}

function countCompletedSets(session) {
  return session.exercises.reduce(
    (count, exercise) => count + exercise.sets.filter((set) => set.completed).length,
    0,
  )
}
