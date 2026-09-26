import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import IconButton from '../../components/IconButton.jsx'
import { cx } from '../../lib/cx.js'
import { formatClock } from '../../lib/format.js'
import styles from './RestTimer.module.css'

const EXTRA_SECONDS = 15

// Cuenta atrás del descanso, que arranca al marcar una serie como hecha.
// Se guarda el instante en que termina (`endsAt`) y se calcula cuánto falta:
// así el reloj sigue bien aunque el navegador frene el temporizador con la
// pantalla apagada, que es justo lo que pasa en el gimnasio.
// La pantalla de la sesión lo vuelve a montar en cada descanso (key), así que
// el estado inicial siempre corresponde al descanso que acaba de empezar.
export default function RestTimer({ rest, onClose }) {
  const [endsAt, setEndsAt] = useState(rest.endsAt)
  const [remaining, setRemaining] = useState(() => secondsLeft(rest.endsAt))

  useEffect(() => {
    const id = setInterval(() => setRemaining(secondsLeft(endsAt)), 250)
    return () => clearInterval(id)
  }, [endsAt])

  function addSeconds() {
    const extended = extendRest(endsAt, EXTRA_SECONDS)
    setEndsAt(extended)
    setRemaining(secondsLeft(extended))
  }

  const isDone = remaining === 0

  return (
    <div className={cx(styles.timer, isDone && styles.done)} role="status">
      <div className={styles.text}>
        <p className={styles.label}>{isDone ? '¡Listo! A la siguiente serie' : 'Descanso'}</p>
        <p className={styles.exercise}>{rest.name}</p>
      </div>

      <p className={`${styles.clock} num`}>{formatClock(remaining)}</p>

      <IconButton
        icon={Plus}
        label={`Sumar ${EXTRA_SECONDS} segundos`}
        variant="tinted"
        size="sm"
        onClick={addSeconds}
      />
      <IconButton icon={X} label="Saltar el descanso" variant="tinted" size="sm" onClick={onClose} />
    </div>
  )
}

function secondsLeft(endsAt) {
  return Math.max(0, Math.round((endsAt - Date.now()) / 1000))
}

// Si el descanso ya terminó, los segundos extra cuentan desde ahora
function extendRest(endsAt, extraSeconds) {
  return Math.max(Date.now(), endsAt) + extraSeconds * 1000
}
