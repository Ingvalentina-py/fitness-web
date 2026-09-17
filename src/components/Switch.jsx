import styles from './Switch.module.css'

// Interruptor de activar/desactivar. Es un checkbox con role="switch":
// los lectores de pantalla lo anuncian como "activado" o "desactivado".
export default function Switch({ label, description, ...inputProps }) {
  return (
    <label className={styles.row}>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      <input className={styles.switch} type="checkbox" role="switch" {...inputProps} />
    </label>
  )
}
