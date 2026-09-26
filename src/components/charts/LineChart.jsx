import { useId, useRef, useState } from 'react'
import { useElementWidth } from './useElementWidth.js'
import styles from './LineChart.module.css'

const HEIGHT = 180
const PADDING = { top: 14, right: 12, bottom: 22, left: 44 }

// Redondea a un múltiplo "bonito" (1, 5, 10, 50, 100…) del tamaño del margen
function roundTo(value, direction, reference) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, reference)))
  const step = reference / magnitude >= 5 ? magnitude * 5 : magnitude
  return direction === 'up' ? Math.ceil(value / step) * step : Math.floor(value / step) * step
}

// Línea para ver cómo evoluciona una medida en el tiempo (una sola serie, sin leyenda:
// el título dice qué se está mirando). El SVG se dibuja al ancho real del contenedor,
// así la línea mide siempre 2 px y los textos se leen igual en celular y computador.
// data: [{ key, label, value }] ya ordenada por fecha.
export default function LineChart({ data, unit = '', formatValue = (value) => value }) {
  const [active, setActive] = useState(null)
  const container = useRef(null)
  const width = useElementWidth(container)
  const id = useId()

  const values = data.map((item) => item.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  // Un poco de aire arriba y abajo (nunca un rango de altura cero) y topes redondeados:
  // un eje que dice "281" en vez de "300" hace ruido sin aportar precisión.
  const margin = max === min ? Math.max(1, max * 0.1) : (max - min) * 0.15
  const top = roundTo(max + margin, 'up', margin)
  const bottom = Math.max(0, roundTo(min - margin, 'down', margin))

  const plotWidth = Math.max(40, width - PADDING.left - PADDING.right)
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom
  const x = (index) =>
    PADDING.left + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth)
  const y = (value) => PADDING.top + plotHeight - ((value - bottom) / (top - bottom)) * plotHeight

  const line = data
    .map((item, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(item.value)}`)
    .join(' ')
  const baseline = PADDING.top + plotHeight
  const area = `${line} L ${x(data.length - 1)} ${baseline} L ${x(0)} ${baseline} Z`
  const last = data.length - 1
  const shown = active === null ? last : active

  return (
    <div className={styles.chart} ref={container}>
      <svg
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        className={styles.svg}
        role="img"
        aria-label={`Evolución con ${data.length} puntos`}
        onPointerLeave={() => setActive(null)}
      >
        {/* Rejilla mínima: solo el techo y el piso del eje */}
        {[top, bottom].map((value) => (
          <g key={value}>
            <line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={y(value)}
              y2={y(value)}
              className={styles.grid}
            />
            <text x={PADDING.left - 8} y={y(value) + 4} className={styles.tick} textAnchor="end">
              {formatValue(value)}
            </text>
          </g>
        ))}

        <path d={area} className={styles.area} />
        <path d={line} className={styles.line} />

        {active !== null && (
          <line
            x1={x(active)}
            x2={x(active)}
            y1={PADDING.top}
            y2={baseline}
            className={styles.crosshair}
          />
        )}

        {/* El punto lleva un anillo del color de la superficie para leerse sobre la línea */}
        <circle cx={x(shown)} cy={y(data[shown].value)} r="7" className={styles.markerRing} />
        <circle cx={x(shown)} cy={y(data[shown].value)} r="5" className={styles.marker} />

        {/* Franjas invisibles: basta con acercarse, no hay que acertarle al punto */}
        {data.map((item, index) => (
          <rect
            key={item.key}
            x={x(index) - plotWidth / Math.max(2, data.length * 2)}
            y={PADDING.top}
            width={plotWidth / Math.max(1, data.length)}
            height={plotHeight}
            className={styles.target}
            tabIndex={0}
            role="button"
            aria-describedby={`${id}-readout`}
            aria-label={`${item.label}: ${formatValue(item.value)}${unit}`}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          />
        ))}

        <text x={PADDING.left} y={HEIGHT - 6} className={styles.tick}>
          {data[0].label}
        </text>
        {data.length > 1 && (
          <text x={width - PADDING.right} y={HEIGHT - 6} className={styles.tick} textAnchor="end">
            {data[last].label}
          </text>
        )}
      </svg>

      <p id={`${id}-readout`} className={styles.readout} role="status">
        <strong className="num">
          {formatValue(data[shown].value)}
          {unit}
        </strong>{' '}
        · {data[shown].label}
        {active === null && data.length > 1 && ' (lo último)'}
      </p>
    </div>
  )
}
