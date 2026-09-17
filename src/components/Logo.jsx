import { useId } from 'react'
import { APP_NAME } from '../app/config.js'
import styles from './Logo.module.css'

// Marca de la app: rayo sobre degradado fucsia → naranja
export default function Logo({ showName = true, size = 36 }) {
  // Id único para el degradado: la marca puede aparecer varias veces en la página
  const gradientId = useId()

  return (
    <span className={styles.logo}>
      <svg className={styles.mark} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-fuchsia)" />
            <stop offset="1" stopColor="var(--color-orange)" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill={`url(#${gradientId})`} />
        <path d="M36 8 16 36h14l-4 20 22-30H34l2-18z" fill="#ffffff" />
      </svg>
      <span className={showName ? styles.name : 'visually-hidden'}>{APP_NAME}</span>
    </span>
  )
}
