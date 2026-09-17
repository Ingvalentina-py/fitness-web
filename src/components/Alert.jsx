import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'
import { cx } from '../lib/cx.js'
import styles from './Alert.module.css'

const ICONS = { error: CircleAlert, success: CircleCheck, warning: TriangleAlert }

// Mensaje destacado. variant: error | success | warning (aviso suave).
// Los errores usan role="alert" para que los lectores de pantalla los anuncien
// de inmediato; el resto, role="status".
export default function Alert({ variant = 'error', children }) {
  const Icon = ICONS[variant]

  return (
    <div
      className={cx(styles.alert, styles[variant])}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon className={styles.icon} size={20} strokeWidth={2.25} aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
