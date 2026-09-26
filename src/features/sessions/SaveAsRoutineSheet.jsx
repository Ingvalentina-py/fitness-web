import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import ChoiceChips from '../../components/ChoiceChips.jsx'
import Field from '../../components/Field.jsx'
import Sheet from '../../components/Sheet.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { useRoutineGroups } from '../routines/useRoutines.js'
import { useSaveSessionAsRoutine } from './useSessions.js'
import styles from './SaveAsRoutineSheet.module.css'

// Guarda lo que hiciste como rutina nueva o actualiza la rutina de la que saliste.
// Las series y el rango de repeticiones objetivo salen de lo que realmente hiciste.
export default function SaveAsRoutineSheet({ session, onClose }) {
  const groupsQuery = useRoutineGroups()
  const saveAsRoutine = useSaveSessionAsRoutine()
  const [mode, setMode] = useState(session.routine ? 'update' : 'create')
  const [name, setName] = useState(session.routine ? '' : 'Mi sesión')
  const [group, setGroup] = useState('')
  const [savedName, setSavedName] = useState(null)

  const groups = groupsQuery.data ?? []
  const fieldErrors = getFieldErrors(saveAsRoutine.error)
  const selectedGroup = group || groups[0]?._id || ''

  function handleSubmit(event) {
    event.preventDefault()
    saveAsRoutine.mutate(
      mode === 'update'
        ? { sessionId: session._id, mode: 'update' }
        : { sessionId: session._id, mode: 'create', name, group: selectedGroup },
      { onSuccess: (routine) => setSavedName(routine.name) },
    )
  }

  if (savedName) {
    return (
      <Sheet open onClose={onClose} title="Listo" footer={<Button onClick={onClose}>Cerrar</Button>}>
        <Alert variant="success">
          {mode === 'update'
            ? `Actualizamos "${savedName}" con lo que hiciste hoy.`
            : `Guardamos "${savedName}" en tus rutinas.`}
        </Alert>
      </Sheet>
    )
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Guardar como rutina"
      footer={
        <Button type="submit" form="save-as-routine" size="lg" disabled={saveAsRoutine.isPending}>
          {saveAsRoutine.isPending ? 'Guardando…' : 'Guardar'}
        </Button>
      }
    >
      <form id="save-as-routine" className={styles.form} onSubmit={handleSubmit}>
        {saveAsRoutine.isError && (
          <Alert>{fieldErrors[''] ?? fieldErrors.mode ?? saveAsRoutine.error.message}</Alert>
        )}

        {session.routine && (
          <ChoiceChips
            legend="¿Dónde la guardamos?"
            name="mode"
            options={[
              { value: 'update', label: `Actualizar "${session.routine.name}"` },
              { value: 'create', label: 'Crear una rutina nueva' },
            ]}
            value={mode}
            onChange={setMode}
          />
        )}

        {mode === 'create' ? (
          <>
            <Field
              label="Nombre de la rutina"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={60}
              required
              error={fieldErrors.name}
            />
            <Field
              as="select"
              label="Grupo"
              value={selectedGroup}
              onChange={(event) => setGroup(event.target.value)}
              error={fieldErrors.group}
            >
              {groups.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Field>
          </>
        ) : (
          <p className={styles.explanation}>
            Los ejercicios, las series y el rango de repeticiones de "{session.routine.name}" pasarán a
            ser los de esta sesión.
          </p>
        )}
      </form>
    </Sheet>
  )
}
