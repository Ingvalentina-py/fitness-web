import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'
import styles from './BackLink.module.css'

// Enlace "← Volver" para pantallas internas (va sobre el fondo: color de texto principal)
export default function BackLink({ to, children }) {
  return (
    <Link to={to} className={styles.link}>
      <ChevronLeft size={20} strokeWidth={2.5} aria-hidden="true" />
      {children}
    </Link>
  )
}
