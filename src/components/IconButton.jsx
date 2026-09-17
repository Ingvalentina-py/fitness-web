import { cx } from '../lib/cx.js'
import styles from './IconButton.module.css'

// Botón solo con ícono. `label` es obligatorio: es lo que anuncia el lector de pantalla
// y lo que aparece al pasar el mouse.
// variant: ghost (transparente) | tinted (fondo blanco suave)
export default function IconButton({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}) {
  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], styles[size], className)}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={size === 'sm' ? 18 : 22} strokeWidth={2.25} aria-hidden="true" />
    </button>
  )
}
