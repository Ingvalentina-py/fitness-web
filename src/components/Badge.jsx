import styles from './Badge.module.css'

// Etiqueta corta, ej. "Pronto". Amarillo meta con texto en tinta (contraste 11:1).
export default function Badge({ children }) {
  return <span className={styles.badge}>{children}</span>
}
