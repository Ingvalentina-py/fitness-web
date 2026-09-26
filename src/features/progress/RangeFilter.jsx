import { useState } from 'react'
import ChoiceChips from '../../components/ChoiceChips.jsx'
import Field from '../../components/Field.jsx'
import { RANGE_PRESETS, presetRange } from './ranges.js'
import styles from './RangeFilter.module.css'

// Filtro de fechas: una sola fila arriba que manda sobre todo lo que viene debajo
export default function RangeFilter({ preset, range, today, onChange }) {
  const [custom, setCustom] = useState(range)

  function choosePreset(value) {
    if (value === 'custom') return onChange({ preset: value, range: custom })
    onChange({ preset: value, range: presetRange(value, today) })
  }

  function changeCustom(changes) {
    const next = { ...custom, ...changes }
    setCustom(next)
    // Un rango al revés no se envía: se espera a que la persona termine de elegir
    if (next.from <= next.to) onChange({ preset: 'custom', range: next })
  }

  return (
    <div className={styles.filter}>
      <ChoiceChips
        legend="Periodo"
        name="range"
        options={RANGE_PRESETS}
        value={preset}
        onChange={choosePreset}
      />

      {preset === 'custom' && (
        <div className={styles.dates}>
          <Field
            label="Desde"
            type="date"
            value={custom.from}
            max={custom.to}
            onChange={(event) => changeCustom({ from: event.target.value })}
          />
          <Field
            label="Hasta"
            type="date"
            value={custom.to}
            min={custom.from}
            max={today}
            onChange={(event) => changeCustom({ to: event.target.value })}
          />
        </div>
      )}
    </div>
  )
}
