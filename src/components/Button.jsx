import { cx } from '../lib/cx.js'
import styles from './Button.module.css'

// variant: primary (degradado) | secondary (borde) | ghost (solo texto)
// size: md | lg
// as: otro elemento con estilo de botón, ej. as={Link} para navegar
export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  fullWidth = false,
  className,
  children,
  ...props
}) {
  const defaultProps = Component === 'button' ? { type: 'button' } : {}

  return (
    <Component
      className={cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      {...defaultProps}
      {...props}
    >
      {Icon && <Icon aria-hidden="true" size={20} strokeWidth={2.25} />}
      {children}
    </Component>
  )
}
