import { motion } from 'motion/react'
import { cx } from '../lib/cx.js'
import styles from './Reveal.module.css'

const EASE_OUT = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}

// Columna que hace aparecer sus <Reveal> uno tras otro al montarse.
// Con "reducir movimiento" activado, MotionConfig (main.jsx) quita el desplazamiento.
export function Stagger({ className, children }) {
  return (
    <motion.div
      className={cx(styles.stack, className)}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}

export function Reveal({ className, children }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
