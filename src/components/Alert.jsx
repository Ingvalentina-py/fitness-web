import { CircleAlert, CircleCheck } from 'lucide-react'
import { cx } from '../lib/cx.js'
import styles from './Alert.module.css'

// Mensaje destacado. Los errores usan role="alert" para que los lectores de pantalla
// los anuncien de inmediato; los mensajes de éxito, role="status".
export default function Alert({ variant = 'error', children }) {
  const Icon = variant === 'error' ? CircleAlert : CircleCheck

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
