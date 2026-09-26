import { Check, Ellipsis, History, NotebookPen, Plus, Repeat2, Trash2, Weight } from 'lucide-react'
import { useState } from 'react'
import ActionSheet from '../../components/ActionSheet.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import { cx } from '../../lib/cx.js'
import { formatNumber } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import { REST_OPTIONS, formatRest } from '../routines/options.js'
import { newDraftSet } from './sessionDraft.js'
import styles from './SessionExerciseCard.module.css'

// Un ejercicio dentro de la sesión: la tabla de series (repeticiones, peso y
// "hecha"), la referencia de la vez anterior y el descanso.
export default function SessionExerciseCard({ item, index, previous, onChange, onRemove, onSetCompleted }) {
  const labels = useMetaLabels()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotes, setShowNotes] = useState(Boolean(item.notes))
  const { exercise } = item

  // La unidad se elige por ejercicio y se aplica a todas sus series: en el gimnasio
  // la máquina no cambia de unidad a mitad de ejercicio.
  const unit = item.sets[0]?.unit ?? 'kg'
  const otherUnit = unit === 'kg' ? 'lb' : 'kg'

  const restOptions = REST_OPTIONS.includes(item.restSeconds)
    ? REST_OPTIONS
    : [...REST_OPTIONS, item.restSeconds].sort((a, b) => a - b)

  const details = [
    labels.equipment(exercise.equipment),
    exercise.primaryMuscles.map(labels.muscle).join(', '),
  ].filter(Boolean)

  function changeSet(key, changes) {
    onChange({ sets: item.sets.map((set) => (set.key === key ? { ...set, ...changes } : set)) })
  }

  // Al marcar una serie se copian las repeticiones y el peso de la anterior si están
  // vacíos: casi siempre se repite lo mismo y así se registra con un solo toque.
  function toggleSet(set, position) {
    if (set.completed) return changeSet(set.key, { completed: false })

    const source = item.sets[position - 1] ?? previousSet(previous, position, unit)
    changeSet(set.key, {
      completed: true,
      reps: set.reps !== '' ? set.reps : (source?.reps ?? ''),
      weight: set.weight !== '' ? set.weight : (source?.weight ?? ''),
    })
    onSetCompleted()
  }

  return (
    <GlassCard aria-labelledby={`exercise-${item.key}`}>
      <header className={styles.header}>
        <span className={`${styles.number} num`} aria-hidden="true">
          {index + 1}
        </span>
        <div className={styles.titles}>
          <h2 id={`exercise-${item.key}`} className={styles.name}>
            {exercise.name}
          </h2>
          <p className={styles.details}>
            {details.join(' · ')}
            {item.isUnilateral && <span className={styles.unilateral}> · Unilateral</span>}
          </p>
        </div>
        <IconButton
          icon={Ellipsis}
          label={`Opciones de ${exercise.name}`}
          onClick={() => setIsMenuOpen(true)}
        />
      </header>

      <PreviousReference previous={previous} isUnilateral={item.isUnilateral} />

      <table className={styles.table}>
        <caption className="visually-hidden">Series de {exercise.name}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.setColumn}>
              Serie
            </th>
            <th scope="col">Reps{item.isUnilateral ? ' (por lado)' : ''}</th>
            <th scope="col">Peso ({unit})</th>
            <th scope="col" className={styles.doneColumn}>
              Hecha
            </th>
            {/* Columna del botón de quitar: tiene que existir para que la tabla cuadre */}
            <th scope="col" className="visually-hidden">
              Quitar
            </th>
          </tr>
        </thead>
        <tbody>
          {item.sets.map((set, position) => (
            <tr key={set.key} className={cx(set.completed && styles.completedRow)}>
              <th scope="row" className={`${styles.setNumber} num`}>
                {position + 1}
              </th>
              <td>
                <input
                  className={`${styles.input} num`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1000}
                  placeholder={item.targetReps ?? '12'}
                  aria-label={`Repeticiones de la serie ${position + 1}`}
                  value={set.reps}
                  onChange={(event) => changeSet(set.key, { reps: event.target.value })}
                />
              </td>
              <td>
                <input
                  className={`${styles.input} num`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={2000}
                  step="0.5"
                  placeholder="0"
                  aria-label={`Peso de la serie ${position + 1} en ${unit}`}
                  value={set.weight}
                  onChange={(event) => changeSet(set.key, { weight: event.target.value })}
                />
              </td>
              <td>
                <button
                  type="button"
                  className={cx(styles.check, set.completed && styles.checked)}
                  aria-pressed={set.completed}
                  aria-label={`Serie ${position + 1} hecha`}
                  onClick={() => toggleSet(set, position)}
                >
                  <Check size={22} strokeWidth={3} aria-hidden="true" />
                </button>
              </td>
              <td className={styles.removeCell}>
                <IconButton
                  icon={Trash2}
                  label={`Quitar la serie ${position + 1}`}
                  size="sm"
                  onClick={() => onChange({ sets: item.sets.filter((current) => current.key !== set.key) })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          disabled={item.sets.length >= 20}
          onClick={() => onChange({ sets: [...item.sets, newDraftSet(unit)] })}
        >
          Agregar serie
        </Button>

        <label className={styles.rest}>
          <span className={styles.restLabel}>Descanso</span>
          <select
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
        </label>
      </div>

      {showNotes && (
        <Field
          as="textarea"
          label="Notas"
          rows={2}
          maxLength={500}
          placeholder="Ej.: subí el peso, me costó la última"
          value={item.notes}
          onChange={(event) => onChange({ notes: event.target.value })}
        />
      )}

      <ActionSheet
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={exercise.name}
        actions={[
          {
            label: `Registrar en ${otherUnit}`,
            icon: Weight,
            onSelect: () =>
              onChange({ sets: item.sets.map((set) => ({ ...set, unit: otherUnit })) }),
          },
          {
            label: item.isUnilateral ? 'Quitar unilateral' : 'Marcar como unilateral',
            icon: Repeat2,
            onSelect: () => onChange({ isUnilateral: !item.isUnilateral }),
          },
          !showNotes && { label: 'Agregar nota', icon: NotebookPen, onSelect: () => setShowNotes(true) },
          { label: 'Quitar ejercicio', icon: Trash2, danger: true, onSelect: onRemove },
        ]}
      />
    </GlassCard>
  )
}

// "La vez anterior": lo que hiciste la última vez que apareció este ejercicio
function PreviousReference({ previous, isUnilateral }) {
  if (!previous || previous.sets.length === 0) {
    return <p className={styles.previousEmpty}>Primera vez que registras este ejercicio. ¡A estrenarlo!</p>
  }

  return (
    <p className={styles.previous}>
      <History size={16} strokeWidth={2.25} aria-hidden="true" />
      <span className="visually-hidden">La vez anterior hiciste: </span>
      <span className={`${styles.previousSets} num`}>
        {previous.sets
          .map((set) => `${set.reps ?? '—'}×${formatNumber(set.weight ?? 0)} ${set.unit}`)
          .join(' · ')}
        {isUnilateral && ' (por lado)'}
      </span>
    </p>
  )
}

// La serie de la vez anterior en la misma posición, para proponer sus valores.
// Solo sirve si se registró en la misma unidad: no se convierten pesos a medias.
function previousSet(previous, position, unit) {
  const set = previous?.sets[position]
  return set?.unit === unit ? set : undefined
}
