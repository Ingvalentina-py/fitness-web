import styles from './Avatar.module.css'

// Inicial del nombre sobre el degradado de la marca
export default function Avatar({ name, size = 40 }) {
  const initial = name?.trim().charAt(0).toUpperCase() || '?'

  return (
    <span className={styles.avatar} style={{ '--size': `${size}px` }} aria-hidden="true">
      {initial}
    </span>
  )
}
