import { Archive, Save } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import Field from '../../components/Field.jsx'
import Sheet from '../../components/Sheet.jsx'
import Switch from '../../components/Switch.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import MuscleSelector from './MuscleSelector.jsx'
import { useArchiveExercise, useCreateExercise, useUpdateExercise } from './useExercises.js'
import styles from './ExerciseFormSheet.module.css'

// Crear o editar un ejercicio propio. Se monta solo mientras está abierto,
// así el formulario empieza siempre con los datos correctos.
// onSaved(ejercicio): opcional, para usar el ejercicio recién creado (ej. agregarlo a una rutina)
export default function ExerciseFormSheet({ exercise, initialName = '', onClose, onSaved }) {
  const { meta } = useMetaLabels()
  const [form, setForm] = useState({
    name: exercise?.name ?? initialName,
    equipment: exercise?.equipment ?? 'machine',
    movementPattern: exercise?.movementPattern ?? 'other',
    primaryMuscles: exercise?.primaryMuscles ?? [],
    secondaryMuscles: exercise?.secondaryMuscles ?? [],
    isUnilateral: exercise?.isUnilateral ?? false,
  })
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false)

  const createExercise = useCreateExercise()
  const updateExercise = useUpdateExercise()
  const archiveExercise = useArchiveExercise()
  const save = exercise ? updateExercise : createExercise
  const fieldErrors = getFieldErrors(save.error)

  const setField = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))

  function handleSubmit(event) {
    event.preventDefault()
    save.mutate(exercise ? { id: exercise._id, ...form } : form, {
      onSuccess: (saved) => (onSaved ? onSaved(saved) : onClose()),
    })
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title={exercise ? 'Editar ejercicio' : 'Nuevo ejercicio'}
      footer={
        <Button type="submit" form="exercise-form" icon={Save} disabled={save.isPending}>
          {save.isPending ? 'Guardando…' : 'Guardar ejercicio'}
        </Button>
      }
    >
      {!meta ? (
        <p>Cargando opciones…</p>
      ) : (
        <form id="exercise-form" className={styles.form} onSubmit={handleSubmit}>
          {save.isError && <Alert>{fieldErrors[''] ?? save.error.message}</Alert>}

          <Field
            label="Nombre"
            value={form.name}
            onChange={(event) => setField('name')(event.target.value)}
            placeholder="Ej.: Hip thrust en Smith"
            maxLength={80}
            required
            error={fieldErrors.name}
          />

          <div className={styles.row}>
            <Field
              as="select"
              label="Equipo"
              value={form.equipment}
              onChange={(event) => setField('equipment')(event.target.value)}
            >
              {meta.equipment.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Field>
            <Field
              as="select"
              label="Patrón de movimiento"
              value={form.movementPattern}
              onChange={(event) => setField('movementPattern')(event.target.value)}
            >
              {meta.movementPatterns.map((pattern) => (
                <option key={pattern.value} value={pattern.value}>
                  {pattern.label}
                </option>
              ))}
            </Field>
          </div>

          <MuscleSelector
            legend="Músculos principales"
            name="primaryMuscles"
            value={form.primaryMuscles}
            onChange={setField('primaryMuscles')}
            disabledValues={form.secondaryMuscles}
            error={fieldErrors.primaryMuscles}
          />
          <MuscleSelector
            legend="Músculos secundarios (opcional)"
            name="secondaryMuscles"
            value={form.secondaryMuscles}
            onChange={setField('secondaryMuscles')}
            disabledValues={form.primaryMuscles}
            error={fieldErrors.secondaryMuscles}
          />

          <Switch
            label="Unilateral"
            description="Se trabaja un lado a la vez (ej. sentadilla búlgara)."
            checked={form.isUnilateral}
            onChange={(event) => setField('isUnilateral')(event.target.checked)}
          />

          {exercise && (
            <Button variant="ghost" icon={Archive} onClick={() => setIsConfirmingArchive(true)}>
              Archivar ejercicio
            </Button>
          )}
        </form>
      )}

      {isConfirmingArchive && (
        <ConfirmSheet
          title={`¿Archivar "${exercise.name}"?`}
          description="Ya no aparecerá en el catálogo. Las rutinas y sesiones que lo usan no cambian."
          confirmLabel="Archivar"
          danger
          isPending={archiveExercise.isPending}
          onClose={() => setIsConfirmingArchive(false)}
          onConfirm={() => archiveExercise.mutate(exercise._id, { onSuccess: onClose })}
        />
      )}
    </Sheet>
  )
}
