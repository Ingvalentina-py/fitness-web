import { Check, Plus } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/Button.jsx'
import Sheet from '../../components/Sheet.jsx'
import { cx } from '../../lib/cx.js'
import { plural } from '../../lib/format.js'
import { useDebouncedValue } from '../../lib/useDebouncedValue.js'
import ExerciseFilters from './ExerciseFilters.jsx'
import ExerciseFormSheet from './ExerciseFormSheet.jsx'
import ExerciseSummary from './ExerciseSummary.jsx'
import { useExerciseSearch } from './useExercises.js'
import styles from './ExercisePickerSheet.module.css'

// Buscar y elegir varios ejercicios de una vez para agregarlos a una rutina.
// Al escribir aparecen con su equipo y músculos (autocompletado).
export default function ExercisePickerSheet({ onClose, onAdd }) {
  const [filters, setFilters] = useState({ search: '', muscle: '', equipment: '' })
  const [selected, setSelected] = useState([])
  const [isCreating, setIsCreating] = useState(false)

  const search = useDebouncedValue(filters.search)
  const query = useExerciseSearch({ ...filters, search })
  const exercises = query.data?.pages.flatMap((page) => page.data) ?? []

  const isSelected = (exercise) => selected.some((item) => item._id === exercise._id)

  function toggle(exercise) {
    setSelected((current) =>
      isSelected(exercise)
        ? current.filter((item) => item._id !== exercise._id)
        : [...current, exercise],
    )
  }

  return (
    <Sheet
      open
      onClose={onClose}
      title="Agregar ejercicios"
      footer={
        <Button size="lg" disabled={selected.length === 0} onClick={() => onAdd(selected)}>
          {selected.length === 0
            ? 'Elige uno o más ejercicios'
            : `Agregar ${plural(selected.length, 'ejercicio', 'ejercicios')}`}
        </Button>
      }
    >
      <ExerciseFilters filters={filters} onChange={setFilters} autoFocus />

      <ul className={styles.results} aria-busy={query.isFetching}>
        {exercises.map((exercise) => (
          <li key={exercise._id}>
            <label className={cx(styles.option, isSelected(exercise) && styles.selected)}>
              <input
                className="visually-hidden"
                type="checkbox"
                checked={isSelected(exercise)}
                onChange={() => toggle(exercise)}
              />
              <span className={styles.check} aria-hidden="true">
                {isSelected(exercise) && <Check size={16} strokeWidth={3} />}
              </span>
              <ExerciseSummary exercise={exercise} />
            </label>
          </li>
        ))}
      </ul>

      {query.isPending && <p className={styles.message}>Buscando…</p>}
      {query.isError && <p className={styles.message}>No pudimos buscar. Intenta de nuevo.</p>}
      {query.isSuccess && exercises.length === 0 && (
        <p className={styles.message}>No encontramos ejercicios con esos filtros.</p>
      )}

      {query.hasNextPage && (
        <Button
          variant="ghost"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
        >
          {query.isFetchingNextPage ? 'Cargando…' : 'Ver más'}
        </Button>
      )}

      <Button variant="secondary" icon={Plus} onClick={() => setIsCreating(true)}>
        Crear ejercicio propio
      </Button>

      {isCreating && (
        <ExerciseFormSheet
          initialName={filters.search}
          onClose={() => setIsCreating(false)}
          onSaved={(exercise) => {
            // El ejercicio recién creado queda elegido para agregarlo
            setSelected((current) => [...current, exercise])
            setIsCreating(false)
          }}
        />
      )}
    </Sheet>
  )
}
