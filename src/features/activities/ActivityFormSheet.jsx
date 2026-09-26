import { Check, Save } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import ChoiceChips from '../../components/ChoiceChips.jsx'
import Field from '../../components/Field.jsx'
import IconByName from '../../components/IconByName.jsx'
import Sheet from '../../components/Sheet.jsx'
import { cx } from '../../lib/cx.js'
import { getFieldErrors } from '../../lib/formErrors.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { useActivityTypes, useCreateActivity, useUpdateActivity } from './useActivities.js'
import styles from './ActivityFormSheet.module.css'

// Duraciones habituales: registrar una clase de una hora debe ser un toque
const QUICK_MINUTES = [30, 45, 60, 90]

// Registrar o corregir baile, clase, bicicleta, patinaje…
// `initialTypeId` viene del panel "+" cuando se toca directamente uno de tus tipos;
// `activity` llega desde el historial cuando se está corrigiendo un registro.
export default function ActivityFormSheet({ activity, initialTypeId, onClose }) {
  const navigate = useNavigate()
  const { meta } = useMetaLabels()
  const { data: activityTypes = [] } = useActivityTypes()
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()
  const save = activity ? updateActivity : createActivity

  const [activityType, setActivityType] = useState(
    activity?.activityType?._id ?? initialTypeId ?? '',
  )
  const [day, setDay] = useState(activity?.day ?? todayInput)
  const [durationMinutes, setDurationMinutes] = useState(
    activity ? String(activity.durationMinutes ?? '') : '',
  )
  const [intensity, setIntensity] = useState(activity?.intensity ?? '')
  const [distanceKm, setDistanceKm] = useState(
    activity?.distanceKm != null ? String(activity.distanceKm) : '',
  )
  const [notes, setNotes] = useState(activity?.notes ?? '')

  const selectedType = activityTypes.find((type) => type._id === activityType)
  const fieldErrors = getFieldErrors(save.error)

  function handleSubmit(event) {
    event.preventDefault()
    const values = {
      activityType,
      // Al corregir, el día solo se reenvía si cambió: así no se mueve la hora original
      ...((!activity || day !== activity.day) && { date: toDate(day) }),
      durationMinutes: Number(durationMinutes),
      ...(intensity && { intensity }),
      ...(selectedType?.usesDistance && distanceKm !== '' && { distanceKm: Number(distanceKm) }),
      ...(notes.trim() && { notes: notes.trim() }),
    }

    save.mutate(activity ? { id: activity._id, ...values } : values, {
      onSuccess: () => {
        onClose()
        // Al registrar, Hoy confirma que quedó guardado; al corregir se vuelve donde estabas
        if (!activity) navigate('/')
      },
    })
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={activity ? 'Corregir actividad' : 'Registrar actividad'}
      footer={
        <Button
          type="submit"
          form="activity-form"
          size="lg"
          icon={Save}
          disabled={save.isPending || !activityType || durationMinutes === ''}
        >
          {save.isPending ? 'Guardando…' : 'Guardar actividad'}
        </Button>
      }
    >
      <form id="activity-form" className={styles.form} onSubmit={handleSubmit}>
        {save.isError && (
          <Alert>{fieldErrors[''] ?? fieldErrors.activityType ?? save.error.message}</Alert>
        )}

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>¿Qué hiciste?</legend>
          <div className={styles.types}>
            {activityTypes.map((type) => (
              <label
                key={type._id}
                className={cx(styles.type, activityType === type._id && styles.selected)}
                style={{ '--tone': type.color }}
              >
                <input
                  className="visually-hidden"
                  type="radio"
                  name="activityType"
                  value={type._id}
                  checked={activityType === type._id}
                  onChange={() => setActivityType(type._id)}
                />
                <span className={styles.typeIcon} aria-hidden="true">
                  <IconByName name={type.icon} size={22} strokeWidth={2.25} />
                </span>
                {type.name}
                {activityType === type._id && <Check size={16} strokeWidth={3} aria-hidden="true" />}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label="Día"
          type="date"
          value={day}
          max={todayInput()}
          onChange={(event) => setDay(event.target.value)}
          error={fieldErrors.date}
        />

        <div className={styles.duration}>
          <Field
            label="Duración (minutos)"
            type="number"
            inputMode="numeric"
            min={1}
            max={1440}
            placeholder="60"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            error={fieldErrors.durationMinutes}
          />
          <div className={styles.quick}>
            {QUICK_MINUTES.map((minutes) => (
              <Button
                key={minutes}
                variant="secondary"
                size="sm"
                onClick={() => setDurationMinutes(String(minutes))}
              >
                {minutes} min
              </Button>
            ))}
          </div>
        </div>

        {meta && (
          <ChoiceChips
            legend="Intensidad (opcional)"
            name="intensity"
            options={meta.intensities}
            value={intensity}
            onChange={setIntensity}
          />
        )}

        {selectedType?.usesDistance && (
          <Field
            label="Distancia (km, opcional)"
            type="number"
            inputMode="decimal"
            min={0}
            max={1000}
            step="0.1"
            placeholder="10"
            value={distanceKm}
            onChange={(event) => setDistanceKm(event.target.value)}
            error={fieldErrors.distanceKm}
          />
        )}

        <Field
          as="textarea"
          label="Notas (opcional)"
          rows={2}
          maxLength={1000}
          placeholder="Ej.: Smart class – Rumba"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </form>
    </Sheet>
  )
}

// Hoy en formato AAAA-MM-DD, que es lo que espera <input type="date">
function todayInput() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

// El día elegido se convierte en un instante: hoy es "ahora" y cualquier otro día,
// su mediodía, para que ninguna diferencia de zona horaria lo corra al día vecino.
function toDate(day) {
  return day === todayInput() ? new Date().toISOString() : new Date(`${day}T12:00`).toISOString()
}
