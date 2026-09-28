import { motion, useReducedMotion } from 'motion/react'
import styles from './Confetti.module.css'

const COLORS = [
  'var(--accent-main)',
  'var(--accent-energy)',
  'var(--accent-calm)',
  'var(--accent-award)',
  'var(--accent-done)',
]

// Papelitos con posición, giro y retraso fijos: se calculan una sola vez al cargar
// el módulo para que cada papelito caiga distinto pero sin recalcular en cada render.
const PIECES = Array.from({ length: 24 }, (_, index) => ({
  left: (index * 37) % 100,
  color: COLORS[index % COLORS.length],
  delay: (index % 8) * 0.09,
  drift: ((index % 5) - 2) * 14,
  rotate: (index % 2 === 0 ? 1 : -1) * (180 + (index % 4) * 90),
  duration: 2.2 + (index % 5) * 0.25,
  round: index % 3 === 0,
}))

// Celebración suave al terminar una sesión. Es decorativa: aria-hidden y sin
// capturar toques. Con "reducir movimiento" activado no se muestra.
export default function Confetti() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <div className={styles.confetti} aria-hidden="true">
      {PIECES.map((piece, index) => (
        <motion.span
          key={index}
          className={piece.round ? styles.round : styles.piece}
          style={{ left: `${piece.left}%`, background: piece.color }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: 260, x: piece.drift, opacity: [0, 1, 1, 0], rotate: piece.rotate }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
