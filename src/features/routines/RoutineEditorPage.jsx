import { Play, Plus, Save } from 'lucide-react'
import { Reorder } from 'motion/react'
import { useRef, useState } from 'react'
import { useBlocker, useNavigate, useParams, useSearchParams } from 'react-router'
import Alert from '../../components/Alert.jsx'
import BackLink from '../../components/BackLink.jsx'
import Button from '../../components/Button.jsx'
import ChoiceChips from '../../components/ChoiceChips.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import Field from '../../components/Field.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { plural } from '../../lib/format.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import ExercisePickerSheet from '../exercises/ExercisePickerSheet.jsx'
import RoutineExerciseItem from './RoutineExerciseItem.jsx'
import { useCreateRoutine, useRoutine, useRoutineGroups, useUpdateRoutine } from './useRoutines.js'
import styles from './RoutineEditorPage.module.css'

// /rutinas/nueva y /rutinas/:routineId
export default function RoutineEditorPage() {
  const { routineId } = useParams()
  const routineQuery = useRoutine(routineId)
  const groupsQuery = useRoutineGroups()
  const { meta } = useMetaLabels()

  const isLoading = (routineId && routineQuery.isPending) || groupsQuery.isPending || !meta

  if (routineQuery.isError || groupsQuery.isError) {
    return (
      <Stagger>
        <BackLink to="/rutinas">Rutinas</BackLink>
        <Alert>
          {routineQuery.error?.status === 404
            ? 'Esta rutina no existe o no es tuya.'
            : 'No pudimos cargar la rutina. Recarga la página.'}
        </Alert>
      </Stagger>
    )
  }

  if (isLoading) {
    return (
      <Stagger>
        <BackLink to="/rutinas">Rutinas</BackLink>
        <GlassCard>Cargando…</GlassCard>
      </Stagger>
    )
  }

  // key: al pasar de una rutina a otra, el formulario empieza de cero
  return (
    <RoutineForm
      key={routineId ?? 'new'}
      routine={routineQuery.data}
      groups={groupsQuery.data}
      goals={meta.routineGoals}
    />
  )
}

// Identificador local para cada ejercicio del formulario (React lo necesita al reordenar)
let nextItemKey = 0

// Ejercicio que ya estaba guardado en la rutina: se respetan sus valores tal cual
function toFormItem(item) {
  return {
    key: `item-${nextItemKey++}`,
    exercise: item.exercise,
    targetSets: item.targetSets ?? 3,
    targetRepsMin: item.targetRepsMin ?? '',
    targetRepsMax: item.targetRepsMax ?? '',
    restSeconds: item.restSeconds ?? 60,
    notes: item.notes ?? '',
  }
}

// Ejercicio recién agregado: valores sugeridos para empezar
function newFormItem(exercise) {
  return toFormItem({ exercise, targetSets: 3, targetRepsMin: 8, targetRepsMax: 12, restSeconds: 60 })
}

// Convierte el formulario al formato que espera la API (números y sin campos vacíos)
function toRequest(form) {
  return {
    name: form.name,
    group: form.group,
    goal: form.goal,
    exercises: form.exercises.map((item) => ({
      exercise: item.exercise._id,
      targetSets: item.targetSets,
      ...(item.targetRepsMin !== '' && { targetRepsMin: Number(item.targetRepsMin) }),
      ...(item.targetRepsMax !== '' && { targetRepsMax: Number(item.targetRepsMax) }),
      restSeconds: item.restSeconds,
      ...(item.notes.trim() && { notes: item.notes.trim() }),
    })),
  }
}

function RoutineForm({ routine, groups, goals }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(() => ({
    name: routine?.name ?? '',
    group: routine?.group ?? searchParams.get('grupo') ?? groups[0]?._id ?? '',
    goal: routine?.goal ?? 'hypertrophy',
    exercises: (routine?.exercises ?? []).map(toFormItem),
  }))
  const [isDirty, setIsDirty] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const createRoutine = useCreateRoutine()
  const updateRoutine = useUpdateRoutine()
  const save = routine ? updateRoutine : createRoutine
  const fieldErrors = getFieldErrors(save.error)

  // Si hay cambios sin guardar, pide confirmación antes de salir de la pantalla
  const hasSavedRef = useRef(false)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !hasSavedRef.current && currentLocation.pathname !== nextLocation.pathname,
  )

  function change(changes) {
    setForm((current) => ({ ...current, ...changes }))
    setIsDirty(true)
  }

  function changeItem(key, changes) {
    change({
      exercises: form.exercises.map((item) => (item.key === key ? { ...item, ...changes } : item)),
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const request = toRequest(form)
    save.mutate(routine ? { id: routine._id, ...request } : request, {
      onSuccess: () => {
        hasSavedRef.current = true
        navigate('/rutinas')
      },
    })
  }

  // Errores de un ejercicio concreto: "exercises.2.targetRepsMax" → { targetRepsMax }
  function itemErrors(index) {
    const prefix = `exercises.${index}.`
    return Object.fromEntries(
      Object.entries(fieldErrors)
        .filter(([field]) => field.startsWith(prefix))
        .map(([field, message]) => [field.slice(prefix.length), message]),
    )
  }

  if (groups.length === 0) {
    return (
      <Stagger>
        <BackLink to="/rutinas">Rutinas</BackLink>
        <Alert>Primero crea un grupo en la pantalla Rutinas para guardar ahí tu rutina.</Alert>
      </Stagger>
    )
  }

  return (
    <Stagger>
      <Reveal>
        <BackLink to="/rutinas">Rutinas</BackLink>
        <PageHeader title={routine ? 'Editar rutina' : 'Nueva rutina'} />
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="routine-data-title">
          <h2 id="routine-data-title" className={styles.sectionTitle}>
            Datos
          </h2>
          <form id="routine-form" className={styles.form} onSubmit={handleSubmit}>
            {save.isError && !fieldErrors.name && <Alert>{fieldErrors[''] ?? save.error.message}</Alert>}

            <Field
              label="Nombre"
              value={form.name}
              onChange={(event) => change({ name: event.target.value })}
              placeholder="Ej.: Inferior A – Fuerza"
              maxLength={60}
              required
              error={fieldErrors.name}
            />
            <Field
              as="select"
              label="Grupo"
              value={form.group}
              onChange={(event) => change({ group: event.target.value })}
              error={fieldErrors.group}
            >
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </Field>
            <ChoiceChips
              legend="Objetivo"
              name="goal"
              options={goals}
              value={form.goal}
              onChange={(goal) => change({ goal })}
            />
          </form>
        </GlassCard>
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="routine-exercises-title">
          <div className={styles.exercisesHeader}>
            <h2 id="routine-exercises-title" className={styles.sectionTitle}>
              Ejercicios
            </h2>
            <span className={styles.count}>
              {plural(form.exercises.length, 'ejercicio', 'ejercicios')}
            </span>
          </div>

          {form.exercises.length === 0 ? (
            <p className={styles.empty}>Agrega los ejercicios de esta rutina.</p>
          ) : (
            <Reorder.Group
              as="ul"
              axis="y"
              values={form.exercises}
              onReorder={(exercises) => change({ exercises })}
              className={styles.list}
            >
              {form.exercises.map((item, index) => (
                <RoutineExerciseItem
                  key={item.key}
                  item={item}
                  index={index}
                  errors={itemErrors(index)}
                  onChange={(changes) => changeItem(item.key, changes)}
                  onRemove={() =>
                    change({ exercises: form.exercises.filter((current) => current.key !== item.key) })
                  }
                />
              ))}
            </Reorder.Group>
          )}

          {fieldErrors.exercises && <Alert>{fieldErrors.exercises}</Alert>}

          <Button variant="secondary" icon={Plus} onClick={() => setIsPickerOpen(true)}>
            Agregar ejercicios
          </Button>
        </GlassCard>
      </Reveal>

      {/* Barra fija abajo: guardar siempre queda a mano */}
      <div className={styles.saveBar}>
        <Button type="submit" form="routine-form" size="lg" fullWidth icon={Save} disabled={save.isPending}>
          {save.isPending ? 'Guardando…' : 'Guardar rutina'}
        </Button>
        {routine && (
          <Button variant="ghost" size="sm" icon={Play} disabled>
            Empezar rutina · llega en la Fase 5
          </Button>
        )}
      </div>

      {isPickerOpen && (
        <ExercisePickerSheet
          onClose={() => setIsPickerOpen(false)}
          onAdd={(exercises) => {
            change({ exercises: [...form.exercises, ...exercises.map(newFormItem)] })
            setIsPickerOpen(false)
          }}
        />
      )}

      {blocker.state === 'blocked' && (
        <ConfirmSheet
          title="¿Salir sin guardar?"
          description="Perderás los cambios que hiciste en esta rutina."
          confirmLabel="Salir sin guardar"
          danger
          onClose={() => blocker.reset()}
          onConfirm={() => blocker.proceed()}
        />
      )}
    </Stagger>
  )
}
