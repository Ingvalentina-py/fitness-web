import { ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'
import BackLink from '../../components/BackLink.jsx'
import Button from '../../components/Button.jsx'
import ChoiceChips from '../../components/ChoiceChips.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { plural } from '../../lib/format.js'
import { useDebouncedValue } from '../../lib/useDebouncedValue.js'
import ExerciseFilters from './ExerciseFilters.jsx'
import ExerciseFormSheet from './ExerciseFormSheet.jsx'
import ExerciseSummary from './ExerciseSummary.jsx'
import { useExerciseSearch } from './useExercises.js'
import styles from './ExerciseCatalogPage.module.css'

const SCOPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'mine', label: 'Mis ejercicios' },
]

export default function ExerciseCatalogPage() {
  const [scope, setScope] = useState('all')
  const [filters, setFilters] = useState({ search: '', muscle: '', equipment: '' })
  // null = cerrado; {} = nuevo; { exercise } = editar
  const [formSheet, setFormSheet] = useState(null)

  const search = useDebouncedValue(filters.search)
  const query = useExerciseSearch({ ...filters, search, scope })
  const exercises = query.data?.pages.flatMap((page) => page.data) ?? []
  const total = query.data?.pages[0]?.pagination.total ?? 0

  return (
    <Stagger>
      <Reveal>
        <BackLink to="/perfil">Perfil</BackLink>
        <PageHeader
          title="Catálogo de ejercicios"
          subtitle="Busca, filtra y crea tus propios ejercicios."
        />
      </Reveal>

      <Reveal>
        <Button icon={Plus} onClick={() => setFormSheet({})}>
          Nuevo ejercicio
        </Button>
      </Reveal>

      <Reveal>
        <GlassCard aria-label="Ejercicios">
          <ChoiceChips
            legend="Mostrar"
            hideLegend
            name="scope"
            options={SCOPE_OPTIONS}
            value={scope}
            onChange={setScope}
          />
          <ExerciseFilters filters={filters} onChange={setFilters} />

          <p className={styles.count} aria-live="polite">
            {query.isPending ? 'Buscando…' : plural(total, 'ejercicio', 'ejercicios')}
          </p>

          <ul className={styles.list}>
            {exercises.map((exercise) => (
              <li key={exercise._id}>
                {exercise.owner ? (
                  // Los propios se pueden editar
                  <button
                    type="button"
                    className={styles.row}
                    onClick={() => setFormSheet({ exercise })}
                    aria-label={`Editar ${exercise.name}`}
                  >
                    <ExerciseSummary exercise={exercise} />
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                ) : (
                  <div className={styles.row}>
                    <ExerciseSummary exercise={exercise} />
                  </div>
                )}
              </li>
            ))}
          </ul>

          {query.isSuccess && exercises.length === 0 && (
            <p className={styles.empty}>
              {scope === 'mine'
                ? 'Aún no creas ejercicios propios. Toca "Nuevo ejercicio" para agregar el primero.'
                : 'No encontramos ejercicios con esos filtros.'}
            </p>
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
        </GlassCard>
      </Reveal>

      {formSheet && (
        <ExerciseFormSheet exercise={formSheet.exercise} onClose={() => setFormSheet(null)} />
      )}
    </Stagger>
  )
}
