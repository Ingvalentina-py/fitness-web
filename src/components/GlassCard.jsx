import { cx } from '../lib/cx.js'
import styles from './GlassCard.module.css'

// Superficie de vidrio: blanco semitransparente con desenfoque del fondo.
// No anides tarjetas de vidrio: cada capa desenfocada cuesta rendimiento en el celular.
export default function GlassCard({ as: Component = 'section', padding = 'md', className, ...props }) {
  return <Component className={cx(styles.card, styles[padding], className)} {...props} />
}
