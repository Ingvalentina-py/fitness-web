import { useId, useState } from 'react'
import { cx } from '../../lib/cx.js'
import styles from './ColumnChart.module.css'

// Busca en cuántas partes dividir el eje para que todas las marcas sean enteras
function chooseDivisions(top, preferred) {
  for (let divisions = preferred; divisions > 1; divisions -= 1) {
    if (top % divisions === 0) return divisions
  }
  return 1
}

// Columnas para comparar magnitudes a lo largo del tiempo, con una sola serie
// (por eso no lleva leyenda: el título ya dice qué se está mirando).
// Se dibuja con HTML y no con SVG: así las barras conservan su grosor máximo y
// su punta redondeada de 4 px en cualquier ancho de pantalla, sin deformarse.
// data: [{ key, label, value, title }]
export default function ColumnChart({
  data,
  maxValue,
  unit = '',
  ticks = 3,
  bestLabel = 'tu mejor marca',
}) {
  const [active, setActive] = useState(null)
  const id = useId()

  const top = Math.max(1, maxValue ?? 0, ...data.map((item) => item.value))
  // El eje se divide en partes que dan números enteros: un "4,67" en la rejilla no ayuda a nadie
  const divisions = chooseDivisions(top, ticks)
  const highest = data.reduce((best, item) => (item.value > (best?.value ?? -1) ? item : best), null)
  const shown = active === null ? highest : data[active]
  // Con muchas columnas solo se rotula una de cada tantas, para que no se amontonen
  const labelEvery = Math.ceil(data.length / 5)

  return (
    <div className={styles.chart}>
      <div className={styles.plot} style={{ '--divisions': divisions }}>
        <div className={styles.axis} aria-hidden="true">
          {Array.from({ length: divisions + 1 }, (_, index) => (
            <span key={index} className={`${styles.tick} num`}>
              {(top / divisions) * (divisions - index)}
            </span>
          ))}
        </div>

        <ul className={styles.columns}>
          {data.map((item, index) => (
            <li key={item.key} className={styles.column}>
              <button
                type="button"
                className={cx(styles.target, active === index && styles.active)}
                aria-describedby={`${id}-readout`}
                aria-label={`${item.title ?? item.label}: ${item.value}${unit}`}
                onPointerEnter={() => setActive(index)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
              >
                <span
                  className={styles.bar}
                  style={{ height: `${(Math.max(0, item.value) / top) * 100}%` }}
                />
              </button>
            </li>
          ))}
        </ul>

        <ul className={styles.labels} aria-hidden="true">
          {data.map((item, index) => (
            <li key={item.key} className={styles.label}>
              {index % labelEvery === 0 ? item.label : ''}
            </li>
          ))}
        </ul>
      </div>

      {/* Un solo valor a la vista: el más alto, o el que se está señalando */}
      <p id={`${id}-readout`} className={styles.readout} role="status">
        {shown && (
          <>
            <strong className="num">
              {shown.value}
              {unit}
            </strong>{' '}
            · {shown.title ?? shown.label}
            {active === null && ` (${bestLabel})`}
          </>
        )}
      </p>
    </div>
  )
}
