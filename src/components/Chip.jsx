import styles from './Chip.module.css'

// Etiqueta con el color (y opcionalmente el ícono) de un tipo de actividad.
// El color llega como valor, porque cada tipo trae el suyo desde la API.
export default function Chip({ icon: Icon, color, children }) {
  return (
    <span className={styles.chip} style={{ '--chip-color': color }}>
      <span className={styles.dot} aria-hidden="true">
        {Icon && <Icon size={14} strokeWidth={2.5} />}
      </span>
      {children}
    </span>
  )
}
