import { useState } from 'react'
import { useNavigate } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import Sheet from '../../components/Sheet.jsx'
import { cx } from '../../lib/cx.js'
import { getFieldErrors } from '../../lib/formErrors.js'
import { formatNumber, plural } from '../../lib/format.js'
import { clearDraft, draftToRequest } from './sessionDraft.js'
import { useCreateSession } from './useSessions.js'
import styles from './FinishSessionSheet.module.css'

// Cómo te sentiste, del 1 al 5 (plan, sección 5.3)
const ENERGY_LEVELS = [
  { value: 1, label: 'Muy baja' },
  { value: 2, label: 'Baja' },
  { value: 3, label: 'Normal' },
  { value: 4, label: 'Buena' },
  { value: 5, label: 'Excelente' },
]

// Últimos datos antes de guardar: duración, energía y notas.
export default function FinishSessionSheet({ draft, stats, elapsedSeconds, onClose }) {
  const navigate = useNavigate()
  const createSession = useCreateSession()
  const [durationMinutes, setDurationMinutes] = useState(() =>
    String(Math.max(1, Math.round(elapsedSeconds / 60))),
  )
  const [energy, setEnergy] = useState(null)
  const [notes, setNotes] = useState('')

  const fieldErrors = getFieldErrors(createSession.error)

  function handleSubmit(event) {
    event.preventDefault()
    const request = draftToRequest(draft, {
      durationMinutes: durationMinutes === '' ? undefined : Number(durationMinutes),
      energy,
      notes,
    })

    createSession.mutate(request, {
      onSuccess: ({ data: session, meta }) => {
        // La sesión ya está guardada en el servidor: el borrador local sobra
        clearDraft()
        navigate(`/sesion/${session._id}/resumen`, { replace: true, state: { records: meta.records } })
      },
    })
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Terminar sesión"
      footer={
        <Button type="submit" form="finish-session" size="lg" disabled={createSession.isPending}>
          {createSession.isPending ? 'Guardando…' : 'Terminar sesión'}
        </Button>
      }
    >
      <p className={styles.summary}>
        <strong>{plural(stats.completedSets, 'serie completada', 'series completadas')}</strong> ·{' '}
        {formatNumber(stats.volumeKg)} kg de volumen
      </p>

      <form id="finish-session" className={styles.form} onSubmit={handleSubmit}>
        {createSession.isError && (
          <Alert>{fieldErrors[''] ?? fieldErrors.exercises ?? createSession.error.message}</Alert>
        )}

        <Field
          label="Duración (minutos)"
          type="number"
          inputMode="numeric"
          min={0}
          max={1440}
          value={durationMinutes}
          onChange={(event) => setDurationMinutes(event.target.value)}
          hint="Se calcula desde que empezaste, pero puedes ajustarla."
          error={fieldErrors.durationMinutes}
        />

        <fieldset className={styles.energy}>
          <legend className={styles.legend}>¿Cómo te sentiste?</legend>
          <div className={styles.levels}>
            {ENERGY_LEVELS.map((level) => (
              <label key={level.value} className={cx(styles.level, energy === level.value && styles.selected)}>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="energy"
                  value={level.value}
                  checked={energy === level.value}
                  onChange={() => setEnergy(level.value)}
                />
                <span className={`${styles.levelNumber} num`} aria-hidden="true">
                  {level.value}
                </span>
                <span className={styles.levelLabel}>{level.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          as="textarea"
          label="Notas (opcional)"
          rows={2}
          maxLength={1000}
          placeholder="Ej.: buen día, subí peso en hip thrust"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </form>
    </Sheet>
  )
}
