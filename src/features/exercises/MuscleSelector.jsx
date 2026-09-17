import ChoiceChips from '../../components/ChoiceChips.jsx'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import styles from './MuscleSelector.module.css'

// Selección de varios músculos, agrupados por región (tren inferior, superior, core…).
// disabledValues: músculos que no se pueden elegir aquí (ej. ya son principales).
export default function MuscleSelector({ legend, name, value, onChange, disabledValues, error }) {
  const { meta } = useMetaLabels()

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      {meta?.muscleRegions.map((region) => (
        <ChoiceChips
          key={region.value}
          legend={region.label}
          name={`${name}-${region.value}`}
          type="checkbox"
          options={meta.muscles.filter((muscle) => muscle.region === region.value)}
          value={value}
          onChange={onChange}
          disabledValues={disabledValues}
        />
      ))}
      {error && <p className={styles.error}>{error}</p>}
    </fieldset>
  )
}
