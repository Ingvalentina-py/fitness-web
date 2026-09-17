import SearchField from '../../components/SearchField.jsx'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import styles from './ExerciseFilters.module.css'

// Buscador + filtros por músculo y equipo (compartidos por el catálogo y el selector)
export default function ExerciseFilters({ filters, onChange, autoFocus = false }) {
  const { meta } = useMetaLabels()
  const setFilter = (key) => (value) => onChange({ ...filters, [key]: value })

  return (
    <div className={styles.filters}>
      <SearchField
        label="Buscar ejercicio"
        placeholder="Buscar: hip thrust, bíceps…"
        value={filters.search}
        onChange={setFilter('search')}
        autoFocus={autoFocus}
      />

      <div className={styles.selects}>
        <select
          className={styles.select}
          aria-label="Filtrar por músculo"
          value={filters.muscle}
          onChange={(event) => setFilter('muscle')(event.target.value)}
        >
          <option value="">Todos los músculos</option>
          {meta?.muscleRegions.map((region) => (
            <optgroup key={region.value} label={region.label}>
              {meta.muscles
                .filter((muscle) => muscle.region === region.value)
                .map((muscle) => (
                  <option key={muscle.value} value={muscle.value}>
                    {muscle.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <select
          className={styles.select}
          aria-label="Filtrar por equipo"
          value={filters.equipment}
          onChange={(event) => setFilter('equipment')(event.target.value)}
        >
          <option value="">Todo el equipo</option>
          {meta?.equipment.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
