import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'
import IconButton from './IconButton.jsx'
import styles from './NumberStepper.module.css'

// Número con botones − y + grandes: se ajusta con un toque, sin abrir el teclado
export default function NumberStepper({ label, value, min, max, onChange }) {
  const labelId = useId()

  return (
    <div className={styles.stepper} role="group" aria-labelledby={labelId}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div className={styles.controls}>
        <IconButton
          icon={Minus}
          label={`Restar ${label.toLowerCase()}`}
          variant="tinted"
          size="sm"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        />
        <output className={`${styles.value} num`} aria-live="polite">
          {value}
        </output>
        <IconButton
          icon={Plus}
          label={`Sumar ${label.toLowerCase()}`}
          variant="tinted"
          size="sm"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        />
      </div>
    </div>
  )
}
