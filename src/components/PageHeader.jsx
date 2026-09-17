import { APP_NAME } from '../app/config.js'
import styles from './PageHeader.module.css'

// Encabezado de cada pantalla. También fija el título de la pestaña del navegador
// (React 19 lleva la etiqueta <title> al <head> automáticamente).
export default function PageHeader({ eyebrow, title, subtitle, documentTitle = title, action }) {
  return (
    <header className={styles.header}>
      <title>{`${documentTitle} · ${APP_NAME}`}</title>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
