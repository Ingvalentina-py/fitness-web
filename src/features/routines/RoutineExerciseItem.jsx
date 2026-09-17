import { GripVertical, NotebookPen, Trash2 } from 'lucide-react'
import { Reorder, useDragControls } from 'motion/react'
import { useId, useState } from 'react'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import IconButton from '../../components/IconButton.jsx'
import NumberStepper from '../../components/NumberStepper.jsx'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { REST_OPTIONS, formatRest } from './options.js'
import styles from './RoutineExerciseItem.module.css'

// Un ejercicio dentro del editor de rutinas: series, rango de repeticiones, descanso y notas
export default function RoutineExerciseItem({ item, index, errors, onChange, onRemove }) {
  const dragControls = useDragControls()
  const labels = useMetaLabels()
  const repsLabelId = useId()
  const restId = useId()
  const [showNotes, setShowNotes] = useState(Boolean(item.notes))
  const { exercise } = item

  // Si la rutina trae un descanso que no está en la lista, se agrega para no perderlo
  const restOptions = REST_OPTIONS.includes(item.restSeconds)
    ? REST_OPTIONS
    : [...REST_OPTIONS, item.restSeconds].sort((a, b) => a - b)

  const details = [
    labels.equipment(exercise.equipment),
    exercise.primaryMuscles.map(labels.muscle).join(', '),
    exercise.isUnilateral && 'Unilateral',
  ].filter(Boolean)

  return (
    <Reorder.Item
      as="li"
      value={item}
      className={styles.item}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ scale: 1.02, boxShadow: '0 16px 32px -12px rgb(28 22 51 / 0.35)' }}
    >
      <div className={styles.header}>
        <span
          className={styles.handle}
          onPointerDown={(event) => dragControls.start(event)}
          aria-hidden="true"
        >
          <GripVertical size={20} />
        </span>
        <span className={`${styles.number} num`} aria-hidden="true">
          {index + 1}
        </span>
        <div className={styles.titles}>
          <p className={styles.name}>
            {exercise.name}
            {exercise.isArchived && <span className={styles.archived}> (archivado)</span>}
          </p>
          <p className={styles.details}>{details.join(' · ')}</p>
        </div>
        <IconButton icon={Trash2} label={`Quitar ${exercise.name}`} onClick={onRemove} />
      </div>

      <div className={styles.targets}>
        <NumberStepper
          label="Series"
          value={item.targetSets}
          min={1}
          max={20}
          onChange={(targetSets) => onChange({ targetSets })}
        />

        <div className={styles.target} role="group" aria-labelledby={repsLabelId}>
          <span id={repsLabelId} className={styles.targetLabel}>
            Repeticiones
          </span>
          <div className={styles.reps}>
            <input
              className={`${styles.numberInput} num`}
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              placeholder="8"
              aria-label="Repeticiones mínimas"
              value={item.targetRepsMin}
              onChange={(event) => onChange({ targetRepsMin: event.target.value })}
            />
            <span aria-hidden="true">–</span>
            <input
              className={`${styles.numberInput} num`}
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              placeholder="12"
              aria-label="Repeticiones máximas"
              aria-invalid={errors.targetRepsMax ? true : undefined}
              value={item.targetRepsMax}
              onChange={(event) => onChange({ targetRepsMax: event.target.value })}
            />
          </div>
        </div>

        <div className={styles.target}>
          <label htmlFor={restId} className={styles.targetLabel}>
            Descanso
          </label>
          <select
            id={restId}
            className={styles.select}
            value={item.restSeconds}
            onChange={(event) => onChange({ restSeconds: Number(event.target.value) })}
          >
            {restOptions.map((seconds) => (
              <option key={seconds} value={seconds}>
                {formatRest(seconds)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.values(errors).map((message) => (
        <p key={message} className={styles.error}>
          {message}
        </p>
      ))}

      {showNotes ? (
        <Field
          as="textarea"
          label="Notas"
          rows={2}
          maxLength={300}
          placeholder="Ej.: pausa de 1 s arriba"
          value={item.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      ) : (
        <Button variant="ghost" size="sm" icon={NotebookPen} onClick={() => setShowNotes(true)}>
          Agregar nota
        </Button>
      )}
    </Reorder.Item>
  )
}
